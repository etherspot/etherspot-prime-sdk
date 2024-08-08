import { IsPositive } from 'class-validator';
import { IsHex32 } from './validators';

export class GetTransactionDto {
  @IsHex32()
  hash: string;

  @IsPositive()
  chainId: number;
}
