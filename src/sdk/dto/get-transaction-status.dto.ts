import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { IsHex32 } from './validators';
import { BridgingProvider } from '../data';

export class GetTransactionStatusDto {
  @IsPositive()
  @IsInt()
  fromChainId: number;

  @IsPositive()
  @IsInt()
  toChainId: number;

  @IsHex32()
  transactionHash: string;

  @IsOptional()
  provider?: BridgingProvider;
}
