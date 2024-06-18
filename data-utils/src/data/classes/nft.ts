import { BaseClass } from '../../../src/common';

export class Nft extends BaseClass<Nft> {
  tokenId: number;

  name: string;

  amount: number;

  image: string;

  ipfsGateway: string;
}
