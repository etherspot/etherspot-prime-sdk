import { BytesLike, utils } from 'ethers';
import { toHex } from '../../common';
import { DynamicWalletProvider } from './dynamic.wallet-provider';
import { EthereumProvider, MessagePayload } from './interfaces';

export class WalletConnect2WalletProvider extends DynamicWalletProvider {
  constructor(readonly provider: EthereumProvider) {
    super('WalletConnect2');

    try {
      const {
        accounts: [address],
        chainId,
      } = provider;

      this.setAddress(address);
      this.setNetworkName(chainId);
    } catch (err) {
      //
    }

    this.updateSessionHandler = this.updateSessionHandler.bind(this);

    provider.on('connect', this.updateSessionHandler);
    provider.on('session_event', this.updateSessionHandler);
    provider.on('disconnect', () => {
      this.setAddress(null);
      this.setNetworkName(null);
    });
  }

  async signMessage(message: BytesLike): Promise<string> {
    const response = await this.provider.signer.request({
      method: 'personal_sign',
      params: [toHex(message), this.address],
    });

    return typeof response === 'string' ? response : null;
  }

  async signTypedData(typedData: MessagePayload, message: any, factoryAddress?: string, initCode?: string): Promise<string> {
    const {domain, types, primaryType} = typedData;

    const msgParams = JSON.stringify({
      domain,
      message,
      primaryType,
      types
    });
    const signature: string = await this.provider.signer.request({
      method: 'eth_signTypedData_v4',
      params: [
        this.address,
        msgParams
      ]
    })

    if (initCode !== '0x') {
      const abiCoderResult = utils.defaultAbiCoder.encode(
        ['address', 'bytes', 'bytes'],
        [factoryAddress, initCode, signature]
      );
      return abiCoderResult + '6492649264926492649264926492649264926492649264926492649264926492'; //magicBytes
    }
    return signature;
  }

  protected updateSessionHandler(error: Error, payload: { params: { accounts: string[]; chainId: number } }): void {
    let address: string = null;
    let chainId: number = null;

    if (!error) {
      try {
        ({
          accounts: [address],
          chainId,
        } = payload.params[0]);
      } catch (err) {
        address = null;
        chainId = null;
      }
    }

    this.setAddress(address);
    this.setNetworkName(chainId);
  }
}
