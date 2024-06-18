import { BigNumber } from 'ethers';
import { TransformBigNumber } from '../../../src/common';

export class AccountBalance {
  token: string;

  @TransformBigNumber()
  balance: BigNumber;

  @TransformBigNumber()
  superBalance: BigNumber;
}
