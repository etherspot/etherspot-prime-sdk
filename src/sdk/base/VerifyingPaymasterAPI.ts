import { ethers } from 'ethers';
import fetch from 'cross-fetch';
import { Buffer } from 'buffer';
import { calcPreVerificationGas } from './calcPreVerificationGas';
import { PaymasterAPI } from './PaymasterAPI';
import { UserOperationStruct } from '../contracts/account-abstraction/contracts/core/BaseAccount';
import { toJSON } from '../common/OperationUtils';

const SIG_SIZE = 65;
const DUMMY_PAYMASTER_AND_DATA =
  '0x0101010101010101010101010101010101010101000000000000000000000000000000000000000000000000000001010101010100000000000000000000000000000000000000000000000000000000000000000101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101';

export interface PaymasterResponse {
  result: {
    paymasterAndData: string;
    verificationGasLimit: string;
    preVerificationGas: string;
    callGasLimit: string;
  }
}

export class VerifyingPaymasterAPI extends PaymasterAPI {
  private paymasterUrl: string;
  private entryPoint: string;
  private context: any;
  private api_key: string;
  private chainId: number;
  constructor(paymasterUrl: string, entryPoint: string, context: any, api_key: string, chainId: number) {
    super();
    this.paymasterUrl = paymasterUrl;
    this.entryPoint = entryPoint;
    this.context = context;
    this.api_key = api_key;
    this.chainId = chainId;
  }

  async getPaymasterAndData(userOp: Partial<UserOperationStruct>): Promise<PaymasterResponse> {
    // Hack: userOp includes empty paymasterAndData which calcPreVerificationGas requires.
    try {
      // userOp.preVerificationGas contains a promise that will resolve to an error.
      await ethers.utils.resolveProperties(userOp);
      // eslint-disable-next-line no-empty
    } catch (_) { }
    const pmOp: Partial<UserOperationStruct> = {
      sender: userOp.sender,
      nonce: userOp.nonce,
      initCode: userOp.initCode,
      callData: userOp.callData,
      callGasLimit: userOp.callGasLimit,
      verificationGasLimit: userOp.verificationGasLimit,
      maxFeePerGas: userOp.maxFeePerGas,
      maxPriorityFeePerGas: userOp.maxPriorityFeePerGas,
      // A dummy value here is required in order to calculate a correct preVerificationGas value.
      paymasterAndData: DUMMY_PAYMASTER_AND_DATA,
      signature: ethers.utils.hexlify(Buffer.alloc(SIG_SIZE, 1)),
    };
    const op = await ethers.utils.resolveProperties(pmOp);
    op.preVerificationGas = calcPreVerificationGas(op);

    // Ask the paymaster to sign the transaction and return a valid paymasterAndData value.
    const paymasterAndData = await fetch(this.paymasterUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ params: [await toJSON(op), this.entryPoint, this.context, this.chainId, this.api_key], jsonrpc: '2', id: 2 }),
    })
      .then(async (res) => {
        const response = await await res.json();
        if (response.error) {
          throw new Error(response.error);
        }
        return response
      })
      .catch((err) => {
        throw new Error(err.message);
      })

    return paymasterAndData;
  }
}

export const getVerifyingPaymaster = (paymasterUrl: string, entryPoint: string, context: any, api_key: string, chainId: number) =>
  new VerifyingPaymasterAPI(paymasterUrl, entryPoint, context, api_key, chainId);
