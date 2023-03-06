import { Wallet } from 'ethers';
import { EtherspotAccountAPI, HttpRpcClient } from './base';

export class Sdk {
  private etherspotAccount: EtherspotAccountAPI;
  private bundler: HttpRpcClient;

  constructor(
    private wallet: Wallet,
    bundlerRpc: string,
    chainId: number,
    entryPoint: string,
    accountFactory: string
  ) {
    this.etherspotAccount = new EtherspotAccountAPI({
      provider: wallet.provider,
      owner: wallet,
      index: 0,
      entryPointAddress: entryPoint,
      factoryAddress: accountFactory
    });
    this.bundler = new HttpRpcClient(bundlerRpc, entryPoint, chainId);
  }

  async getCounterFactualAddress(): Promise<string> {
    return this.etherspotAccount.getCounterFactualAddress();
  }

  async getUserOpReceipt(
    userOpHash: string,
    timeout = 30000,
    interval = 5000
  ): Promise<string | null> {
    const block = await this.wallet.provider.getBlock('latest')
    const endtime = Date.now() + timeout
    while (Date.now() < endtime) {
      const events = await this.etherspotAccount.epView.queryFilter(
        this.etherspotAccount.epView.filters.UserOperationEvent(userOpHash),
        Math.max(100, block.number - 100)
      )
      if (events.length > 0) {
        return events[0].transactionHash
      }
      await new Promise((resolve) => setTimeout(resolve, interval))
    }
    return null
  }
}