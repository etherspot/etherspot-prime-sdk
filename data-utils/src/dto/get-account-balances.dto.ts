import { IsOptional, IsPositive, IsString } from 'class-validator';
import { IsAddress } from './validators';

export class GetAccountBalancesDto {
  @IsOptional()
  @IsAddress({
    each: true,
  })
  tokens?: string[] = [];

  @IsOptional()
  @IsString()
  provider?: string = null;

  @IsAddress()
  account: string = null;

  @IsPositive()
  chainId: number;
}
