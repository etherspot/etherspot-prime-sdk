import { IsOptional, IsPositive } from 'class-validator';
import { IsAddress } from './validators';

export class GetTransactionsDto {
  @IsOptional()
  @IsPositive()
  chainId?: number;

  @IsOptional()
  @IsAddress()
  account?: string;
}
