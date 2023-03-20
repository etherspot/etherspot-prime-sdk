import { Contract } from 'ethers';
import { IEntryPoint } from 'src/contracts';

export class EtherspotWalletFactoryAPI {
  static createAccount(
    factoryAddress: string,
    entryPoint: IEntryPoint,
    registry: string,
    owner: string,
    salt: number,
  ): string {
    const walletFactory = new Contract(factoryAddress, [
      'function createAccount(IEntryPoint _entryPoint, address, _registry, address owner, uint256 salt) returns(address)',
    ]);

    const encodedData = walletFactory.interface.encodeFunctionData('createAccount', [
      entryPoint,
      registry,
      owner,
      salt,
    ]);
    return encodedData;
  }
}
