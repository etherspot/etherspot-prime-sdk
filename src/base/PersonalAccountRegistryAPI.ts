import { Contract } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import { PersonalAccountRegistry, PersonalAccountRegistry__factory } from '../contracts';
import { hexConcat } from 'ethers/lib/utils';

export interface PersonalAccountRegistryApiParams {
  provider: Provider;
  owner: Signer;
  factoryAddress?: string;
  index?: number;
}

export class PersonalAccountRegistryAPI {
  provider: Provider;
  factoryAddress?: string;
  owner: Signer;

  factory: PersonalAccountRegistry;

  constructor(params: PersonalAccountRegistryApiParams) {
    this.provider = params.provider;
    this.factoryAddress = params.factoryAddress;
    this.owner = params.owner;
  }

  static deployAccount(factoryAddress: string, owner: string): string {
    const walletFactory = new Contract(factoryAddress, ['function deployAccount(address owner)']);

    const encodedData = walletFactory.interface.encodeFunctionData('deployAccount', [owner]);
    return encodedData;
  }

  async getAccountInitCode(): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== '') {
        this.factory = PersonalAccountRegistry__factory.connect(this.factoryAddress, this.provider);
      } else {
        throw new Error('no factory to get initCode');
      }
    }
    return hexConcat([
      this.factory.address,
      this.factory.interface.encodeFunctionData('deployAccount', [await this.owner.getAddress()]),
    ]);
  }
}
