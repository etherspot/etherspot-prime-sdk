import { Type } from 'class-transformer';
import { PaginationResult } from '../../../src/common/classes/pagination-result';
import { TokenListToken } from './token-list-token';

export class PaginatedTokens extends PaginationResult<TokenListToken> {
  @Type(() => TokenListToken)
  items: TokenListToken[];
}
