import { IsBoolean, IsOptional } from 'class-validator';
import { BigNumberish } from 'ethers';
import { IsAddress, IsBigNumberish } from './validators';

export class GetExchangeOffersDto {
  @IsAddress()
  fromTokenAddress: string;

  @IsAddress()
  toTokenAddress: string;

  @IsBigNumberish({
    positive: true,
  })
  fromAmount: BigNumberish;

  fromChainId: number;

  @IsAddress()
  fromAddress: string;

  @IsOptional()
  @IsAddress()
  toAddress?: string;

  @IsOptional()
  @IsBoolean()
  showZeroUsd?: boolean;
}
