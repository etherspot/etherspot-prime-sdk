import { BytesLike, TypedDataField } from 'ethers';
import { toHex } from '../../common';
import { DynamicWalletProvider } from './dynamic.wallet-provider';
import { EthereumProvider } from './interfaces';

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

  async signTypedData(typedData: TypedDataField[], message: any, accountAddress: string): Promise<string> {
    
    const domainSeparator = {
      name: "EtherspotWallet",
      version: "2.0.0",
      chainId: this.provider.chainId,
      verifyingContract: accountAddress
    };
    const signature = await this.provider.signer.request({
      method: 'eth_signTypedData_v4', 
      params: [
        this.address,
        {
          "types": {
            "EIP712Domain": [
              {
                "name": "name",
                "type": "string"
              },
              {
                "name": "version",
                "type": "string"
              },
              {
                "name": "chainId",
                "type": "uint256"
              },
              {
                "name": "verifyingContract",
                "type": "address"
              }
            ],
            "message": typedData
          },
          "primaryType": "message",
          "domain": domainSeparator,
          "message": message
        }
      ]
    })
    return typeof signature === 'string' ? signature : null;
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
