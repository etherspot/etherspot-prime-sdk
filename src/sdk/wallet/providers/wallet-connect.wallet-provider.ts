import { BytesLike, utils } from 'ethers';
import { toHex } from '../../common';
import { DynamicWalletProvider } from './dynamic.wallet-provider';
import { MessagePayload, WalletConnectConnector } from './interfaces';

export class WalletConnectWalletProvider extends DynamicWalletProvider {
  static connect(connector: WalletConnectConnector): WalletConnectWalletProvider {
    return new WalletConnectWalletProvider(connector);
  }

  protected constructor(readonly connector: WalletConnectConnector) {
    super('WalletConnect');

    try {
      const {
        accounts: [address],
        chainId,
      } = connector;

      this.setAddress(address);
      this.setNetworkName(chainId);
    } catch (err) {
      //
    }

    this.updateSessionHandler = this.updateSessionHandler.bind(this);

    connector.on('connect', this.updateSessionHandler);
    connector.on('session_update', this.updateSessionHandler);
    connector.on('disconnect', () => {
      this.setAddress(null);
      this.setNetworkName(null);
    });
  }

  async signMessage(message: BytesLike): Promise<string> {
    const response = await this.connector.signPersonalMessage([
      toHex(message), //
      this.address,
    ]);

    return response || null;
  }

  async signTypedData(typedData: MessagePayload, message: any, factoryAddress?: string, initCode?: string): Promise<string> {
    const signature: string = await this.connector.request({
      method: 'eth_signTypedData_v4',
      params: [
        this.address,
        {
          domain: typedData.domain,
          message,
          primaryType: typedData.primaryType,
          types: typedData.types,
        }
      ]
    });

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
