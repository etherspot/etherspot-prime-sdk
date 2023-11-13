import { BigNumber, BigNumberish, Contract, ethers } from 'ethers';
import {
  EntryPoint__factory,
} from '../contracts';
import { arrayify, hexConcat } from 'ethers/lib/utils';
import { BaseApiParams, BaseAccountAPI } from './BaseAccountAPI';
import { SimpleAccountAbi } from '../contracts/SimpleAccount/SimpleAccountAbi';
import { SimpleAccountFactoryAbi } from '../contracts/SimpleAccount/SimpleAccountFactoryAbi';

/**
 * constructor params, added no top of base params:
 * @param owner the signer object for the account owner
 * @param factoryAddress address of contract "factory" to deploy new contracts (not needed if account already deployed)
 * @param index nonce value used when creating multiple accounts for the same owner
 */
export interface SimpleAccountApiParams extends BaseApiParams {
  factoryAddress?: string;
  index?: number;
}

/**
 * An implementation of the BaseAccountAPI using the SimpleAccountWallet contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
export class SimpleAccountAPI extends BaseAccountAPI {
  factoryAddress?: string;
  index: number;
  accountAddress?: string;

  /**
   * our account contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  accountContract?: Contract;

  factory?: Contract;

  constructor(params: SimpleAccountApiParams) {
    super(params);
    this.factoryAddress = params.factoryAddress;
    this.index = params.index ?? 0;
  }

  async _getAccountContract(): Promise<Contract> {
    this.accountContract = new ethers.Contract(this.accountAddress, SimpleAccountAbi, this.provider);
    return this.accountContract;
  }

  /**
   * return the value to put into the "initCode" field, if the account is not yet deployed.
   * this value holds the "factory" address, followed by this account's information
   */
  async getAccountInitCode(): Promise<string> {
    this.factory = new ethers.Contract(this.factoryAddress, SimpleAccountFactoryAbi, this.provider);

    return hexConcat([
      this.factoryAddress,
      this.factory.interface.encodeFunctionData('createAccount', [
        this.services.walletService.walletAddress,
        this.index,
      ]),
    ]);
  }

  async getCounterFactualAddress(): Promise<string> {
    try {
      const initCode = await this.getAccountInitCode();
      const entryPoint = EntryPoint__factory.connect(this.entryPointAddress, this.provider);
      await entryPoint.callStatic.getSenderAddress(initCode);

      throw new Error("getSenderAddress: unexpected result");
    } catch (error: any) {
      const addr = error?.errorArgs?.sender;
      if (!addr) throw error;
      if (addr === ethers.constants.AddressZero) throw new Error('Unsupported chain_id/walletFactoryAddress');
      this.accountContract = new ethers.Contract(addr, SimpleAccountAbi, this.provider);
      this.accountAddress = addr;
    }
    return this.accountAddress;
  }

  async getNonce(): Promise<BigNumber> {
    console.log('checking nonce...');
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0);
    }
    const accountContract = await this._getAccountContract();
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
    return signature;
  }

  get epView() {
    return this.entryPointView;
  }

  async encodeBatch(targets: string[], values: BigNumberish[], datas: string[]): Promise<string> {
    const accountContract = await this._getAccountContract();
    return accountContract.interface.encodeFunctionData('executeBatch', [targets, datas]);
  }
}
