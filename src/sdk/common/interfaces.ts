import { BigNumberish } from "ethers";

export interface BatchUserOpsRequest {
  to: string[];
  data?: string[];
  value?: BigNumberish[];
}

export interface UserOpsRequest { 
  to: string;
  data?: string;
  value?: BigNumberish;
}
