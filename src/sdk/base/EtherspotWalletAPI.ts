import { BigNumber, BigNumberish, Contract, ethers } from 'ethers';
import {
  EtherspotWallet,
  EtherspotWallet__factory,
  EtherspotWalletFactory,
  EtherspotWalletFactory__factory,
} from '../contracts';
import { arrayify, defaultAbiCoder, hexConcat } from 'ethers/lib/utils';
import { BaseApiParams, BaseAccountAPI } from './BaseAccountAPI';
import { EtherspotWallet7579Factory__factory, EtherspotWallet7579__factory } from '../contracts/factories/src/ERC7579/wallet';
import { EtherspotWallet7579, EtherspotWallet7579Factory } from '../contracts/src/ERC7579/wallet';
import { IModule } from '../contracts/erc7579-ref-impl/src/interfaces/IModule.sol';
import { BOOTSTRAP_ABI, BootstrapConfig, _makeBootstrapConfig, makeBootstrapConfig } from './Bootstrap';

/**
 * constructor params, added no top of base params:
 * @param owner the signer object for the account owner
 * @param factoryAddress address of contract "factory" to deploy new contracts (not needed if account already deployed)
 * @param index nonce value used when creating multiple accounts for the same owner
 */
export interface EtherspotWalletApiParams extends BaseApiParams {
  factoryAddress?: string;
  index?: number;
  predefinedAccountAddress?: string;
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
  predefinedAccountAddress?: string;

  /**
   * our account contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  accountContract?: EtherspotWallet7579;

  factory?: EtherspotWallet7579Factory;

  constructor(params: EtherspotWalletApiParams) {
    super(params);
    this.factoryAddress = params.factoryAddress;
    this.index = params.index ?? 0;
    this.predefinedAccountAddress = params.predefinedAccountAddress ?? null;
  }

  async checkAccountAddress(address: string): Promise<void> {
    const accountContract = EtherspotWallet7579__factory.connect(address, this.provider);
    if (!(await accountContract.isOwner(this.services.walletService.EOAAddress))) {
      throw new Error('the specified accountAddress does not belong to the given EOA provider')
    }
    else {
      this.accountAddress = address;
    }
  }

  async _getAccountContract(): Promise<EtherspotWallet7579 | Contract> {
    if (this.accountContract == null) {
      this.accountContract = EtherspotWallet7579__factory.connect(await this.getAccountAddress(), this.provider);
    }
    return this.accountContract;
  }

  /**
   * return the value to put into the "initCode" field, if the account is not yet deployed.
   * this value holds the "factory" address, followed by this account's information
   */
  async getAccountInitCode(): Promise<string> {
    if (this.factoryAddress != null && this.factoryAddress !== '') {
      this.factory = EtherspotWallet7579Factory__factory.connect(this.factoryAddress, this.provider);
    } else {
      throw new Error('no factory to get initCode');
    }

    const iface = new ethers.utils.Interface(BOOTSTRAP_ABI);
    const validators: BootstrapConfig[] = makeBootstrapConfig('0x1e714c551fe6234b6ee406899ec3be9234ad2124', '0x');
    const executors: BootstrapConfig[] = makeBootstrapConfig('0x0000000000000000000000000000000000000000', '0x');
    const hook: BootstrapConfig = _makeBootstrapConfig('0x0000000000000000000000000000000000000000', '0x');
    const fallbacks: BootstrapConfig[] = makeBootstrapConfig('0x0000000000000000000000000000000000000000', '0x');

    const initMSAData = iface.encodeFunctionData(
      "initMSA",
      [validators, executors, hook, fallbacks]
    );

    const initCode = ethers.utils.defaultAbiCoder.encode(
      ["address", "address", "bytes"],
      [this.services.walletService.EOAAddress, '0x4f695ad7694863c8280FCEBf2Cb220E361ce4eA0', initMSAData]
    );
    const encodedValue = ethers.utils.solidityKeccak256(['string'], [this.index.toString()]);
    const hexlifyValue = ethers.utils.hexlify(encodedValue);
    const salt = ethers.utils.arrayify(hexlifyValue)
    return hexConcat([
      this.factoryAddress,
      this.factory.interface.encodeFunctionData('createAccount', [
        salt,
        initCode,
      ]),
    ]);
  }

  async getCounterFactualAddress(): Promise<string> {
    if (this.predefinedAccountAddress) {
      await this.checkAccountAddress(this.predefinedAccountAddress);
    }

    const encodedValue = ethers.utils.solidityKeccak256(['string'], [this.index.toString()]);
    const hexlifyValue = ethers.utils.hexlify(encodedValue);
    const salt = ethers.utils.arrayify(hexlifyValue);
    const iface = new ethers.utils.Interface(BOOTSTRAP_ABI);
    const validators: BootstrapConfig[] = makeBootstrapConfig('0x1e714c551fe6234b6ee406899ec3be9234ad2124', '0x');
    const executors: BootstrapConfig[] = makeBootstrapConfig('0x0000000000000000000000000000000000000000', '0x');
    const hook: BootstrapConfig = _makeBootstrapConfig('0x0000000000000000000000000000000000000000', '0x');
    const fallbacks: BootstrapConfig[] = makeBootstrapConfig('0x0000000000000000000000000000000000000000', '0x');

    const initMSAData = iface.encodeFunctionData(
      "initMSA",
      [validators, executors, hook, fallbacks]
    );

    const initCode = ethers.utils.defaultAbiCoder.encode(
      ["address", "address", "bytes"],
      [this.services.walletService.EOAAddress, '0x4f695ad7694863c8280FCEBf2Cb220E361ce4eA0', initMSAData]
    );

    if (!this.accountAddress) {
      this.factory = EtherspotWallet7579Factory__factory.connect(this.factoryAddress, this.provider);
      this.accountAddress = await this.factory.getAddress(
        salt,
        initCode,
      );
    }
    return this.accountAddress;
  }

  async getNonce(key = 0): Promise<BigNumber> {
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0);
    }
    return await this.nonceManager.getNonce(await this.getAccountAddress(), key);
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
    return accountContract.interface.encodeFunctionData('execute', [targets[0], values[0], datas[0]]);
    // return accountContract.interface.encodeFunctionData('executeBatch', [targets, values, datas]);
  }
}
