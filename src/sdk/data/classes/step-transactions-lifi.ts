import { BigNumberish, BytesLike } from 'ethers';
import { TransformBigNumber } from '../../common';

export class StepTransaction {
  to?: string;

  data?: BytesLike;

  @TransformBigNumber()
  value?: BigNumberish;

  @TransformBigNumber()
  gasLimit?: BigNumberish;

  @TransformBigNumber()
  gasPrice?: BigNumberish;

  chainId?: number;

  type?: number;
}

export class StepTransactions {
  items: StepTransaction[]
}