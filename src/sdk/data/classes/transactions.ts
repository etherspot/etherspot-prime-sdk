import { BigNumber } from 'ethers';
import { TransactionStatuses } from '../constants';

export class Transactions {
  transactions: UserOpTransaction[];
  pageInfo?: {
    currentPage: number;
    limit: number;
  };
}

export class UserOpTransaction {
  chainId: number;
  sender: string;
  target?: string | null;
  transactionHash: string;
  userOpHash: string;
  actualGasCost: number;
  actualGasUsed: number;
  success: TransactionStatuses;
  timestamp: number;
  paymaster: string;
  value: number;
  blockExplorerUrl: string;
  input: string;
  nonce: number;
  initCode?: string;
  callData?: string;
  accountGasLimits?: string;
  gasFees?: string;
  callGasLimit: BigNumber;
  verificationGasLimit: BigNumber;
  preVerificationGas: BigNumber;
  maxFeePerGas: BigNumber;
  maxPriorityFeePerGas: BigNumber;
  paymasterAndData?: string;
  signature?: string;
  beneficiary?: string;
  nativeTransfers?: NativeTransfersEntity[];
  erc20Transfers?: Erc20TransfersEntity[];
  nftTransfers?: NFTTransfersEntity[];
}

export class Erc20TransfersEntity {
  from: string;
  to: string;
  value: number;
  asset?: string;
  address: string;
  decimal: number;
}

export class NativeTransfersEntity {
  from: string;
  to: string;
  value: string;
  asset?: string;
  address: string;
  decimal: number;
  data: string;
}

export class NFTTransfersEntity {
  from: string;
  to: string;
  value: number;
  tokenId: number;
  asset?: string;
  category: string;
  address: string;
}
