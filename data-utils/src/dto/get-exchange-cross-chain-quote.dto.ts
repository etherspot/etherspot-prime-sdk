import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';
import { IsAddress, IsBigNumberish } from './validators';
import { CrossChainServiceProvider, LiFiBridge } from '../../src/data';

export class GetExchangeCrossChainQuoteDto {
  @IsAddress()
  fromTokenAddress: string;

  @IsAddress()
  toTokenAddress: string;

  @IsPositive()
  @IsInt()
  @Type(() => Number)
  fromChainId: number | null;

  @IsPositive()
  @IsInt()
  @Type(() => Number)
  toChainId: number;

  @IsBigNumberish()
  fromAmount: BigNumber;

  @IsAddress()
  fromAddress: string;

  @IsOptional()
  serviceProvider?: CrossChainServiceProvider;

  @IsOptional()
  @IsAddress()
  toAddress?: string;

  @IsOptional()
  lifiBridges?: LiFiBridge[];

  @IsOptional()
  @IsBoolean()
  showZeroUsd?: boolean;
}
