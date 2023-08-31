import { UserOperationStruct } from '../contracts/src/aa-4337/core/BaseAccount';
import { PaymasterResponse } from './VerifyingPaymasterAPI';

/**
 * an API to external a UserOperation with paymaster info
 */
export class PaymasterAPI {
  /**
   * @param userOp a partially-filled UserOperation (without signature and paymasterAndData
   *  note that the "preVerificationGas" is incomplete: it can't account for the
   *  paymasterAndData value, which will only be returned by this method..
   * @returns the value to put into the PaymasterAndData, undefined to leave it empty
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPaymasterAndData(userOp: Partial<UserOperationStruct>): Promise<PaymasterResponse | undefined> {
    return { paymasterAndData: '0x', verificationGasLimit: '0x' };
  }
}
