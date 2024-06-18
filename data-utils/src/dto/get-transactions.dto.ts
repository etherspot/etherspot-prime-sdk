import { IsPositive } from 'class-validator';
import { IsAddress } from './validators';
import { PaginationDto } from './pagination.dto';

export class GetTransactionsDto extends PaginationDto {
  @IsAddress()
  account: string = null;

  @IsPositive()
  chainId: number;
}
