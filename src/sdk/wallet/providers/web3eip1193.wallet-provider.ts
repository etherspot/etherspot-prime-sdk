import { BytesLike, utils } from 'ethers';
import { prepareAddress, toHex } from '../../common';
import { NetworkNames, prepareNetworkName } from '../../network';
import { MessagePayload, Web3eip1193Provider } from './interfaces';
import { DynamicWalletProvider } from './dynamic.wallet-provider';

export class Web3eip1193WalletProvider extends DynamicWalletProvider {
  static async connect(provider: Web3eip1193Provider, type = 'Web3'): Promise<Web3eip1193WalletProvider> {
    const result = new Web3eip1193WalletProvider(provider, type);
    const connected = await result.refresh();
    return connected ? result : null;
  }

  constructor(readonly web3: Web3eip1193Provider, type = 'Web3') {
    super(type);
  }

  get address(): string {
    return this.address$.value;
  }

  get networkName(): NetworkNames {
    return this.networkName$.value;
  }

  async refresh(): Promise<boolean> {
    let result = false;
    const chainId = await this.sendRequest<string>('eth_chainId');
    const networkName = prepareNetworkName(chainId);

    if (networkName) {
      const accounts = await this.sendRequest<string[]>('eth_accounts');

      if (Array.isArray(accounts) && accounts.length) {
        const address = prepareAddress(accounts[0]);

        if (address) {
          this.setAddress(address);
          this.setNetworkName(networkName);

          result = true;
        }
      }
    }

    return result;
  }

  async signMessage(message: BytesLike): Promise<string> {
    return this.sendRequest('personal_sign', [toHex(message), this.address]);
  }

  async signTypedData(typedData: MessagePayload, message: any, factoryAddress?: string, initCode?: string): Promise<string> {
    const {domain, types, primaryType} = typedData;

    const msgParams = JSON.stringify({
      domain,
      message,
      primaryType,
      types
    });
    const signature = await this.sendRequest('eth_signTypedData_v4', [
      this.address,
      msgParams
    ]);

    if (initCode !== '0x') {
      const abiCoderResult = utils.defaultAbiCoder.encode(
        ['address', 'bytes', 'bytes'],
        [factoryAddress, initCode, signature]
      );
      return abiCoderResult + '6492649264926492649264926492649264926492649264926492649264926492'; //magicBytes
    }
    return signature;
  }

  protected async sendRequest<T = any>(method: string, params: any[] = []): Promise<T> {
    try {
      const result = await this.web3.request({
        method,
        params,
      });

      return result || null;
    } catch (error) {
      return error;
    }
  }
}
