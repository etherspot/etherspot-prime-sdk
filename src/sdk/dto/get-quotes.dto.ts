import { BigNumberish } from 'ethers';
import { IsAddress, IsBigNumberish } from './validators';
import { IsOptional } from 'class-validator';
import { QuotesProvider } from '../data';

export class GetQuotesDto {
  @IsAddress()
  fromAddress: string;

  @IsAddress()
  toAddress: string;

  fromChainId: number;

  toChainId: number;

  @IsAddress()
  fromToken: string;

  @IsBigNumberish({
    positive: true,
  })
  fromAmount: BigNumberish;

  slippage: number;

  @IsOptional()
  provider?: QuotesProvider;
}
