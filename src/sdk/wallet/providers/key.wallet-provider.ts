import { Wallet, BytesLike, utils } from 'ethers';
import { MessagePayload, WalletProvider } from './interfaces';

export class KeyWalletProvider implements WalletProvider {
  readonly type = 'Key';
  readonly address: string;

  readonly wallet: Wallet;

  constructor(privateKey: string) {
    this.wallet = new Wallet(privateKey);

    const { address } = this.wallet;

    this.address = address;
  }

  async signMessage(message: BytesLike): Promise<string> {
    return this.wallet.signMessage(message);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signTypedData(typedData: MessagePayload, message: any, factoryAddress?: string, initCode?: string): Promise<string> {
    const {domain, types} = typedData;

    // EIP Domain has to be removed because ethers will add it using `domain`
    if(types["EIP712Domain"]) {
      delete typedData.types["EIP712Domain"];
    }
    const signature = await this.wallet._signTypedData(
      domain,
      types,
      message
    );

    if (initCode !== '0x') {
      const abiCoderResult = utils.defaultAbiCoder.encode(
        ['address', 'bytes', 'bytes'],
        [factoryAddress, initCode, signature]
      );
      return abiCoderResult + '6492649264926492649264926492649264926492649264926492649264926492'; //magicBytes
    }
    return signature;
  }
}
