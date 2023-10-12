import { BigNumber, BigNumberish, Contract, ethers } from 'ethers';
import {
  EntryPoint__factory,
  EtherspotWallet,
  EtherspotWallet__factory,
  EtherspotWalletFactory,
  EtherspotWalletFactory__factory,
  IEntryPoint__factory,
} from '../contracts';
import { arrayify, hexConcat } from 'ethers/lib/utils';
import { BaseApiParams, BaseAccountAPI } from './BaseAccountAPI';
import { Factory } from '../interfaces';
import { KernelAccountAbi } from '../contracts/zeroDevKernal/KernalAccountAbi';
import { MultiSendAbi } from '../contracts/zeroDevKernal/MultiSendAbi';
import { Safe } from '../network/constants';
import { SimpleAccountAbi } from '../contracts/SimpleAccount/SimpleAccountAbi';
import { SimpleAccountFactoryAbi } from '../contracts/SimpleAccount/SimpleAccountFactoryAbi';
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
export interface EtherspotWalletApiParams extends BaseApiParams {
  factoryAddress?: string;
  index?: number;
  factoryUsed: Factory;
}

/**
 * An implementation of the BaseAccountAPI using the EtherspotWallet contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
export class EtherspotWalletAPI extends BaseAccountAPI {
  factoryAddress?: string;
  index: number;
  accountAddress?: string;

  /**
   * our account contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  accountContract?: EtherspotWallet | Contract;

  factory?: EtherspotWalletFactory | Contract;

  factoryUsed: Factory;

  multisend: Contract;

  constructor(params: EtherspotWalletApiParams) {
    super(params);
    this.factoryAddress = params.factoryAddress;
    this.index = params.index ?? 0;
    this.factoryUsed = params.factoryUsed;
  }

  async _getAccountContract(): Promise<EtherspotWallet | Contract> {
    if (this.accountContract == null && this.factoryUsed == Factory.ETHERSPOT) {
      this.accountContract = EtherspotWallet__factory.connect(await this.getAccountAddress(), this.provider);
    }
    if (this.accountContract == null && this.factoryUsed == Factory.ZERO_DEV) {
      this.accountContract = new ethers.Contract(await this.getAccountAddress(), KernelAccountAbi, this.provider);
    }
    return this.accountContract;
  }

  protected async getKernelFactoryInitCode(): Promise<string> {
    try {
      const KernalFactoryInterface = new ethers.utils.Interface(KernelFactoryAbi)
      return KernalFactoryInterface.encodeFunctionData('createAccount', [
        "0xf048AD83CB2dfd6037A43902a2A5Be04e53cd2Eb", // Kernel Implementation Address
        new ethers.utils.Interface(KernelAccountAbi).encodeFunctionData(
          "initialize",
          ["0xd9AB5096a832b9ce79914329DAEE236f8Eea0390", this.services.walletService.walletAddress], // Kernel Validation Address
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
    if (this.factoryAddress != null && this.factoryAddress !== '' && this.factoryUsed == Factory.ETHERSPOT) {
      this.factory = EtherspotWalletFactory__factory.connect(this.factoryAddress, this.provider);
    } else if (this.factoryAddress != null && this.factoryAddress !== '' && this.factoryUsed == Factory.ZERO_DEV) {
      this.factory = new ethers.Contract(this.factoryAddress, KernelFactoryAbi, this.provider);
      return hexConcat([
        this.factoryAddress, await this.getKernelFactoryInitCode()
      ]);
    } else if (this.factoryAddress != null && this.factoryAddress != '' && this.factoryUsed == Factory.SIMPLE_ACCOUNT) {
      this.factory = new ethers.Contract(this.factoryAddress, SimpleAccountFactoryAbi, this.provider);
    } else {
      throw new Error('no factory to get initCode');
    }

    return hexConcat([
      this.factoryAddress,
      this.factory.interface.encodeFunctionData('createAccount', [
        this.services.walletService.walletAddress,
        this.index,
      ]),
    ]);
  }

  async getCounterFactualAddress(): Promise<string> {
    if (this.factoryUsed === Factory.ETHERSPOT) {
      this.factory = EtherspotWalletFactory__factory.connect(this.factoryAddress, this.provider);
      this.accountAddress = await this.factory.getAddress(
        this.services.walletService.walletAddress,
        this.index,
      );
    } else {
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
        if (this.factoryUsed === Factory.ZERO_DEV)
          this.accountContract = new ethers.Contract(addr, KernelAccountAbi, this.provider);
        else this.accountContract = new ethers.Contract(addr, SimpleAccountAbi, this.provider);
        this.accountAddress = addr;
      }
    }
    return this.accountAddress;
  }

  async getNonce(): Promise<BigNumber> {
    console.log('checking nonce...');
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0);
    }
    const accountContract = await this._getAccountContract();
    if (this.factoryUsed == Factory.ZERO_DEV) {
      const entryPoint = IEntryPoint__factory.connect(this.entryPointAddress, this.provider);
      return await entryPoint.getNonce(this.accountAddress, 0);
    }
    return accountContract.getNonce();
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

  async signUserOpHash(userOpHash: string): Promise<string> {
    const signature = await this.services.walletService.signMessage(arrayify(userOpHash));
    if (this.factoryUsed == Factory.ZERO_DEV)
      return ethers.utils.hexConcat([
        "0x00000000",
        signature,
      ]);
    return signature;
  }

  get epView() {
    return this.entryPointView;
  }

  async encodeBatch(targets: string[], values: BigNumberish[], datas: string[]): Promise<string> {
    const accountContract = await this._getAccountContract();
    if (this.factoryUsed === Factory.ETHERSPOT)
      return accountContract.interface.encodeFunctionData('executeBatch', [targets, values, datas]);
    if (this.factoryUsed === Factory.SIMPLE_ACCOUNT) {
      return new ethers.Contract(this.accountAddress, SimpleAccountAbi, this.provider).interface.encodeFunctionData('executeBatch', [targets, datas]);
    }
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
    this.accountContract = new ethers.Contract(this.accountAddress, KernelAccountAbi, this.provider);
    return this.accountContract.interface.encodeFunctionData('execute', [
      this.multisend.address,
      ethers.constants.Zero,
      data,
      Operation.DelegateCall,
    ])
  }
}
