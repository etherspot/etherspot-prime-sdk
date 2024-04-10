import { BigNumberish, BytesLike } from "ethers";

export class ConnextTransaction {
    to?: string;
    data?: BytesLike;
    value?: BigNumberish;
    gasLimit?: string;
    gasPrice?: string;
    chainId?: number;
}
