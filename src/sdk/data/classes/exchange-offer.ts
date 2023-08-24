import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';
import { TransformBigNumber } from '../../common';
import { ExchangeProviders } from '../constants';
import { TransactionData } from './transaction-data';

export class ExchangeOffer {
  provider: ExchangeProviders;

  @TransformBigNumber()
  receiveAmount: BigNumber;

  exchangeRate: number;

  @Type(() => TransactionData)
  transactions: TransactionData[];
}
