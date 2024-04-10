import { IsInt, IsPositive } from 'class-validator';
import { IsHex32 } from './validators';

export class GetConnextTransactionStatusDto {
  @IsPositive()
  @IsInt()
  fromChainId: number;

  @IsPositive()
  @IsInt()
  toChainId: number;

  @IsHex32()
  transactionHash: string;
}
