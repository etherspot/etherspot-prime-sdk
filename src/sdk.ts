import { BigNumberish, Wallet, providers } from 'ethers';
import { EtherspotWalletAPI, HttpRpcClient } from './base';
import { TransactionDetailsForUserOp } from './base/TransactionDetailsForUserOp';
import { UserOperationStruct } from './contracts/src/aa-4337/core/BaseAccount';
import { getGasFee } from './common';

export class LiteSdk {
  private EtherspotWallet: EtherspotWalletAPI;
  private bundler: HttpRpcClient;

  constructor(private wallet: Wallet, bundlerRpc: string, chainId: number, entryPoint: string, accountFactory: string) {
    this.EtherspotWallet = new EtherspotWalletAPI({
      provider: wallet.provider,
      owner: wallet,
      index: 0,
      entryPointAddress: entryPoint,
      factoryAddress: accountFactory,
    });
    this.bundler = new HttpRpcClient(bundlerRpc, entryPoint, chainId);
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
    console.log('sdk.ts:: sign(): tx:', tx);
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

  async encodeExecute(target: string, value: BigNumberish, data: string): Promise<string> {
    return this.EtherspotWallet.encodeExecute(target, value, data);
  }
}
