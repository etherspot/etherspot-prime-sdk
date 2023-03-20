import { Wallet, providers } from 'ethers';
import { EtherspotWalletAPI, HttpRpcClient, PersonalAccountRegistryAPI } from './base';
import { TransactionDetailsForUserOp } from './base/TransactionDetailsForUserOp';
import { UserOperationStruct } from './contracts/src/aa-4337/core/BaseAccount';
import { getGasFee } from './common';
import { BytesLike, hexConcat } from 'ethers/lib/utils';
import { PersonalAccountRegistry } from './contracts';

export class LiteSdk {
  private EtherspotWallet: EtherspotWalletAPI;
  private bundler: HttpRpcClient;
  private PersonalAccountRegistry: PersonalAccountRegistryAPI;

  constructor(
    private wallet: Wallet,
    bundlerRpc: string,
    chainId: number,
    entryPoint: string,
    registry: string,
    accountFactory: string,
  ) {
    this.EtherspotWallet = new EtherspotWalletAPI({
      provider: wallet.provider,
      owner: wallet,
      index: 0,
      entryPointAddress: entryPoint,
      registryAddress: registry,
      factoryAddress: accountFactory,
    });
    this.bundler = new HttpRpcClient(bundlerRpc, entryPoint, chainId);
    this.PersonalAccountRegistry = new PersonalAccountRegistryAPI({
      provider: wallet.provider,
      factoryAddress: accountFactory,
      owner: wallet,
    });
  }

  async getCounterFactualAddress(): Promise<string> {
    return this.EtherspotWallet.getCounterFactualAddress();
  }

  async getUserOpReceipt(userOpHash: string, timeout = 30000, interval = 5000): Promise<string | null> {
    const block = await this.wallet.provider.getBlock('latest');
    const endtime = Date.now() + timeout;
    while (Date.now() < endtime) {
      const events = await this.EtherspotWallet.epView.queryFilter(
        this.EtherspotWallet.epView.filters.UserOperationEvent(userOpHash),
        Math.max(100, block.number - 100),
      );
      if (events.length > 0) {
        return events[0].transactionHash;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  }

  async sign(tx: TransactionDetailsForUserOp) {
    const gas = await this.getGasFee();
    return this.EtherspotWallet.createSignedUserOp({
      ...tx,
      ...gas,
    });
  }

  async getHash(userOp: UserOperationStruct) {
    return this.EtherspotWallet.getUserOpHash(userOp);
  }

  async send(userOp: UserOperationStruct) {
    return this.bundler.sendUserOpToBundler(userOp);
  }

  async getGasFee() {
    return getGasFee(this.wallet.provider as providers.JsonRpcProvider);
  }

  // added below

  async getAccountContract() {
    return this.EtherspotWallet._getAccountContract();
  }

  get epView() {
    return this.EtherspotWallet.epView;
  }

  get regView() {
    return this.EtherspotWallet.regView;
  }

  async getAccountInitCodePAR(): Promise<string> {
    return this.PersonalAccountRegistry.getAccountInitCode();
  }
}
