import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../../src/common';

export class InternalTransaction {
  from: string;

  to: string;

  @TransformBigNumber()
  value: BigNumber;
}
