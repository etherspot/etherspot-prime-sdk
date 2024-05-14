import { BigNumber, BigNumberish, Contract, constants, ethers } from 'ethers';
import { arrayify, hexConcat } from 'ethers/lib/utils';
import { BaseApiParams, BaseAccountAPI } from './BaseAccountAPI';
import { EtherspotWallet7579Factory__factory, EtherspotWallet7579__factory } from '../contracts/factories/src/ERC7579/wallet';
import { ModularEtherspotWallet, EtherspotWallet7579Factory } from '../contracts/src/ERC7579/wallet';
import { BOOTSTRAP_ABI, BootstrapConfig, _makeBootstrapConfig, makeBootstrapConfig } from './Bootstrap';
import { Networks } from '../network/constants';
import { CALL_TYPE, EXEC_TYPE, getExecuteMode } from '../common';

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
  bootstrapAddress?: string;
  multipleOwnerECDSAValidatorAddress?: string;

  /**
   * our account contract.
   * should support the "execFromEntryPoint" and "nonce" methods
   */
  accountContract?: ModularEtherspotWallet;

  factory?: EtherspotWallet7579Factory;

  constructor(params: EtherspotWalletApiParams) {
    super(params);
    this.factoryAddress = params.factoryAddress;
    this.index = params.index ?? 0;
    this.predefinedAccountAddress = params.predefinedAccountAddress ?? null;
    this.bootstrapAddress = Networks[params.optionsLike.chainId].contracts.bootstrap;
    this.multipleOwnerECDSAValidatorAddress = Networks[params.optionsLike.chainId].contracts.multipleOwnerECDSAValidator;
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

  async _getAccountContract(): Promise<Contract> {
    if (this.accountContract == null) {
      this.accountContract = EtherspotWallet7579__factory.connect(await this.getAccountAddress(), this.provider);
    }
    return this.accountContract;
  }

  async getInitCode(): Promise<string> {
    const iface = new ethers.utils.Interface(BOOTSTRAP_ABI);
    const validators: BootstrapConfig[] = makeBootstrapConfig(this.multipleOwnerECDSAValidatorAddress, '0x');
    const executors: BootstrapConfig[] = makeBootstrapConfig(constants.AddressZero, '0x');
    const hook: BootstrapConfig = _makeBootstrapConfig(constants.AddressZero, '0x');
    const fallbacks: BootstrapConfig[] = makeBootstrapConfig(constants.AddressZero, '0x');

    const initMSAData = iface.encodeFunctionData(
      "initMSA",
      [validators, executors, hook, fallbacks]
    );

    const initCode = ethers.utils.defaultAbiCoder.encode(
      ["address", "address", "bytes"],
      [this.services.walletService.EOAAddress, this.bootstrapAddress, initMSAData]
    );

    return initCode;
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

    const initCode = await this.getInitCode();
    const salt = ethers.utils.hexZeroPad(ethers.utils.hexValue(this.index), 32);

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

    const salt = ethers.utils.hexZeroPad(ethers.utils.hexValue(this.index), 32);
    const initCode = await this.getInitCode();

    if (!this.accountAddress) {
      this.factory = EtherspotWallet7579Factory__factory.connect(this.factoryAddress, this.provider);
      this.accountAddress = await this.factory.getAddress(
        salt,
        initCode,
      );
    }
    return this.accountAddress;
  }

  async getNonce(key: BigNumber = BigNumber.from(0)): Promise<BigNumber> {
    const dummyKey = ethers.utils.getAddress(key.toHexString()) + "00000000"
    return await this.nonceManager.getNonce(await this.getAccountAddress(), BigInt(dummyKey));
  }

  /**
   * encode a method call from entryPoint to our contract
   * @param target
   * @param value
   * @param data
   */
  async encodeExecute(target: string, value: BigNumberish, data: string): Promise<string> {
    const accountContract = await this._getAccountContract();
    const executeMode = getExecuteMode({
      callType: CALL_TYPE.SINGLE,
      execType: EXEC_TYPE.DEFAULT
    });

    const calldata = hexConcat([
      target,
      ethers.utils.hexZeroPad(ethers.utils.hexValue(value), 32),
      data
    ]);

    return accountContract.interface.encodeFunctionData('execute', [executeMode, calldata]);
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

    const executeMode = getExecuteMode({
      callType: CALL_TYPE.BATCH,
      execType: EXEC_TYPE.DEFAULT
    });

    const result = targets.map((target, index) => ({
      target: target,
      value: values[index],
      callData: datas[index]
    }));

    const calldata = ethers.utils.defaultAbiCoder.encode(
      ["tuple(address target,uint256 value,bytes callData)[]"],
      [result]
    );

    return accountContract.interface.encodeFunctionData('execute', [executeMode, calldata]);
  }
}
