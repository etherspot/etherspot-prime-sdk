import { BigNumber, BigNumberish, Contract, ethers } from 'ethers';
import {
  EntryPoint__factory,
  IEntryPoint__factory,
} from '../contracts';
import { arrayify, hexConcat } from 'ethers/lib/utils';
import { BaseApiParams, BaseAccountAPI } from './BaseAccountAPI';
import { KernelAccountAbi } from '../contracts/zeroDevKernal/KernalAccountAbi';
import { MultiSendAbi } from '../contracts/zeroDevKernal/MultiSendAbi';
import { Safe } from '../network/constants';
import { KernelFactoryAbi } from '../contracts/zeroDevKernal/KernalFactoryAbi';

/**
 * For Interacting with safe contract
 */
enum Operation {
  Call,
  DelegateCall,
}

/**
 * constructor params, added no top of base params:
 * @param owner the signer object for the account owner
 * @param factoryAddress address of contract "factory" to deploy new contracts (not needed if account already deployed)
 * @param index nonce value used when creating multiple accounts for the same owner
 */
export interface ZeroDevWalletApiParams extends BaseApiParams {
  factoryAddress?: string;
  index?: number;
}

/**
 * An implementation of the BaseAccountAPI using the EtherspotWallet contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
export class ZeroDevWalletAPI extends BaseAccountAPI {
  factoryAddress?: string;
  index: number;
  accountAddress?: string;

  /**
   * our account contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  accountContract?: Contract;

  factory?: Contract;

  multisend: Contract;

  constructor(params: ZeroDevWalletApiParams) {
    super(params);
    this.factoryAddress = params.factoryAddress;
    this.index = params.index ?? 0;
  }

  async _getAccountContract(): Promise<Contract> {
    this.accountContract = new ethers.Contract(this.accountAddress, KernelAccountAbi, this.provider);
    return this.accountContract;
  }

  protected async getKernelFactoryInitCode(): Promise<string> {
    try {
      const KernalFactoryInterface = new ethers.utils.Interface(KernelFactoryAbi)
      return KernalFactoryInterface.encodeFunctionData('createAccount', [
        "0xf048AD83CB2dfd6037A43902a2A5Be04e53cd2Eb", // Kernel Implementation Address
        new ethers.utils.Interface(KernelAccountAbi).encodeFunctionData(
          "initialize",
          ["0xd9AB5096a832b9ce79914329DAEE236f8Eea0390", this.services.walletService.EOAAddress], // Kernel Validation Address
        ),
        this.index,
      ],
      );
    } catch (err: any) {
      throw new Error("Factory Code generation failed");
    }
  }

  /**
   * return the value to put into the "initCode" field, if the account is not yet deployed.
   * this value holds the "factory" address, followed by this account's information
   */
  async getAccountInitCode(): Promise<string> {

    this.factory = new ethers.Contract(this.factoryAddress, KernelFactoryAbi, this.provider);
    return hexConcat([
      this.factoryAddress, await this.getKernelFactoryInitCode()
    ]);
  }

  async getCounterFactualAddress(): Promise<string> {
    if (!this.accountAddress) {
      try {
        const initCode = await this.getAccountInitCode();
        const entryPoint = EntryPoint__factory.connect(this.entryPointAddress, this.provider);
        await entryPoint.callStatic.getSenderAddress(initCode);

        throw new Error("getSenderAddress: unexpected result");
      } catch (error: any) {
        const addr = error?.errorArgs?.sender;
        if (!addr) throw error;
        if (addr === ethers.constants.AddressZero) throw new Error('Unsupported chain_id');
        const chain = await this.provider.getNetwork().then((n) => n.chainId);
        const ms = Safe.MultiSend[chain.toString()];
        if (!ms)
          throw new Error(
            `Multisend contract not deployed on network: ${chain.toString()}`
          );
        this.multisend = new ethers.Contract(ms, MultiSendAbi, this.provider);
        this.accountContract = new ethers.Contract(addr, KernelAccountAbi, this.provider);
        this.accountAddress = addr;
      }
    }
    return this.accountAddress;
  }

  async getNonce(key = 0): Promise<BigNumber> {
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0);
    }
    return await this.nonceManager.getNonce(await this.getAccountAddress(), key);
  }

  async signUserOpHash(userOpHash: string): Promise<string> {
    const signature = await this.services.walletService.signMessage(arrayify(userOpHash));
    return ethers.utils.hexConcat([
      "0x00000000",
      signature,
    ]);
  }

  get epView() {
    return this.entryPointView;
  }

  /**
   * encode a method call from entryPoint to our contract
   * @param target
   * @param value
   * @param data
   */
  async encodeExecute(target: string, value: BigNumberish, data: string): Promise<string> {
    const accountContract = await this._getAccountContract();
    return accountContract.interface.encodeFunctionData('execute', [target, value, data]);
  }

  async encodeBatch(targets: string[], values: BigNumberish[], datas: string[]): Promise<string> {
    const accountContract = await this._getAccountContract();
    const data = this.multisend.interface.encodeFunctionData("multiSend", [
      ethers.utils.hexConcat(
        targets.map((c, index) =>
          ethers.utils.solidityPack(
            ["uint8", "address", "uint256", "uint256", "bytes"],
            [
              Operation.Call,
              c,
              values[index],
              ethers.utils.hexDataLength(datas[index]),
              datas[index],
            ]
          )
        )
      ),
    ]);
    return accountContract.interface.encodeFunctionData('execute', [
      this.multisend.address,
      ethers.constants.Zero,
      data,
      Operation.DelegateCall,
    ])
  }
}
