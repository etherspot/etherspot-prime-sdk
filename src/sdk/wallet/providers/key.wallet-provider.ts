import { Signer } from '@ethersproject/abstract-signer';
import { Wallet, BytesLike, providers } from 'ethers';
import { WalletProvider } from './interfaces';

export class KeyWalletProvider implements WalletProvider {
  readonly type = 'Key';
  readonly address: string;

  readonly wallet: Wallet;

  readonly signer: Signer;

  readonly provider: providers.JsonRpcProvider;

  constructor(privateKey: string, provider: providers.JsonRpcProvider) {
    console.log('key based provider', provider, privateKey);
    this.wallet = new Wallet(privateKey, provider);

    this.signer = new Wallet(privateKey, provider)

    const { address } = this.wallet;

    this.address = address;
  }

  async sendTransaction(transaction: providers.TransactionRequest): Promise<providers.TransactionResponse> {
    return this.wallet.sendTransaction(transaction)
  }

  async signMessage(message: BytesLike): Promise<string> {
    console.log('sign: ', message);
    return this.wallet.signMessage(message);
  }

}
