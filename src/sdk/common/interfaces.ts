import { BigNumberish } from "ethers";

export interface BatchTransactionRequest {
  to: string[];
  data?: string[];
  value?: BigNumberish[];
}

export interface TransactionRequest { 
  to: string;
  data?: string;
  value?: BigNumberish;
}
