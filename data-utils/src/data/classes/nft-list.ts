import { Type } from 'class-transformer';
import { PaginationResult } from '../../../src/common/classes/pagination-result';
import { NftCollection } from './nft-collection';

export class NftList extends PaginationResult<NftCollection> {
  @Type(() => NftCollection)
  items: NftCollection[];
}
