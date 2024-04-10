import { BigNumberish } from 'ethers';
import { IsAddress, IsBigNumberish } from './validators';

export class getConnextQuotesDto {
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
}
