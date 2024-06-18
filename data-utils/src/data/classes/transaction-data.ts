import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../../src/common';

export class TransactionData {
  to: string;

  data: string;

  @TransformBigNumber()
  value: BigNumber;
}
