import { BigNumberish, BytesLike } from "ethers";

export class QuoteTransaction {
    to?: string;
    data?: BytesLike;
    value?: BigNumberish;
    gasLimit?: string;
    gasPrice?: string;
    chainId?: number;
}
