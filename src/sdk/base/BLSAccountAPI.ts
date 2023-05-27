import { BigNumber, BigNumberish, ethers } from 'ethers';
import {
  BLSAccount,
  BLSAccount__factory,
  BLSAccountFactory,
  BLSAccountFactory__factory,
  BLSSignatureAggregator__factory,
} from '../contracts';
import { UserOperationStruct } from '../contracts/src/aa-4337/core/BaseAccount';

import { BlsSignerFactory } from '@thehubbleproject/bls/dist/signer';
import { arrayify, hexConcat, keccak256, resolveProperties } from 'ethers/lib/utils';
import { BaseApiParams, BaseAccountAPI } from './BaseAccountAPI';
import { solG2 } from '@thehubbleproject/bls/dist/mcl';

const BLS_DOMAIN = arrayify(keccak256(Buffer.from('eip4337.bls.domain')));

export interface BLSAccountApiParams extends BaseApiParams {
  owner: string;
  aggregatorAddress: string;
  factoryAddress: string;
  index?: number;
}

type Signer = ReturnType<BlsSignerFactory['getSigner']>;
export class BLSAccountAPI extends BaseAccountAPI {
  factory?: BLSAccountFactory;
  factoryAddress?: string;
  accountContract?: BLSAccount;
  blsSignerFactory?: BlsSignerFactory;
  owner: string;
  index: number;
  aggregatorAddress: string;
  signer?: Signer;

  constructor(params: BLSAccountApiParams) {
    super(params);
    this.index = params.index ?? 0;
    this.owner = params.owner;
    this.aggregatorAddress = params.aggregatorAddress;
    this.factoryAddress = params.factoryAddress;
  }

  async _getAccountContract(): Promise<BLSAccount> {
    // const provider = this.services.walletService.getWalletProvider();
    if (this.accountContract == null) {
      this.accountContract = BLSAccount__factory.connect(await this.getAccountAddress(), this.provider);
    }
    return this.accountContract;
  }

  async getAccountInitCode(): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== '') {
        this.factory = BLSAccountFactory__factory.connect(this.factoryAddress, this.provider);
      } else {
        throw new Error('no factory to get initCode');
      }
    }
    if (this.factory === undefined) {
      throw new Error('no factory');
    }
    return hexConcat([
      this.factory.address,
      this.factory.interface.encodeFunctionData('createAccount', [
        this.entryPointAddress,
        this.index,
        await this.getPublicKey(),
      ]),
    ]);
  }

  async getNonce(): Promise<BigNumber> {
    if (await this.checkAccountPhantom()) {
      return BigNumber.from(0);
    }
    const accountContract = await this._getAccountContract();
    return await accountContract.nonce();
  }

  async encodeExecute(target: string, value: BigNumberish, data: string): Promise<string> {
    const accountContract = await this._getAccountContract();
    return accountContract.interface.encodeFunctionData('execute', [target, value, data]);
  }

  async getUserOpHash(userOp: UserOperationStruct): Promise<string> {
    const op = await resolveProperties(userOp);
    op.signature = ethers.constants.HashZero;
    const aggContract = BLSSignatureAggregator__factory.connect(this.aggregatorAddress, this.provider);
    const userOpHash = await aggContract.callStatic.getUserOpHash(op);
    return userOpHash;
  }

  async signUserOpHash(userOpHash: string): Promise<string> {
    const signer = await this.getSigner();
    const sign = hexConcat(signer.sign(userOpHash));
    return sign;
  }

  async getPublicKey(): Promise<solG2> {
    const signer = await this.getSigner();
    return signer.pubkey;
  }

  private async getSigner(): Promise<Signer> {
    if (this.blsSignerFactory == null) {
      this.blsSignerFactory = await BlsSignerFactory.new();
    }
    if (this.signer == null) {
      this.signer = this.blsSignerFactory.getSigner(arrayify(BLS_DOMAIN), this.owner);
    }
    return this.signer;
  }

  async encodeBatch(targets: string[], datas: string[]): Promise<string> {
    const accountContract = await this._getAccountContract();
    return accountContract.interface.encodeFunctionData('executeBatch', [targets, datas]);
  }
}
