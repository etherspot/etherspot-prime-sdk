import { BigNumberish } from 'ethers';

/**
 * basic struct to create a UserOperation from
 */
export interface TransactionDetailsForUserOp {
  // target address, or multiple addresses for a batch
  target: string | string[];
  // target data or multiple target datas for a batch
  data: string | string[];
  value?: BigNumberish;
  values?: BigNumberish[];
  gasLimit?: BigNumberish;
  maxFeePerGas?: BigNumberish;
  maxPriorityFeePerGas?: BigNumberish;
}

export interface TransactionGasInfoForUserOp {
  gasLimit?: BigNumberish;
  maxFeePerGas?: BigNumberish;
  maxPriorityFeePerGas?: BigNumberish;
}
