import { defaultAbiCoder, hexConcat, hexlify, keccak256 } from 'ethers/lib/utils';
import { EntryPoint__factory } from '../contracts';
import { UserOperationStruct } from '../contracts/src/aa-4337/core/BaseAccount';
import { ethers } from 'ethers';

const entryPointAbi: any = EntryPoint__factory.abi;

// UserOperation is the first parameter of validateUseOp
const validateUserOpMethod = 'simulateValidation';
const UserOpType = entryPointAbi.find((entry) => entry.name === validateUserOpMethod)?.inputs[0];
if (UserOpType == null) {
  throw new Error(
    `unable to find method ${validateUserOpMethod} in EP ${entryPointAbi
      .filter((x) => x.type === 'function')
      .map((x) => x.name)
      .join(',')}`,
  );
}

export const AddressZero = ethers.constants.AddressZero;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function encode(typevalues: Array<{ type: string; val: any }>, forSignature: boolean): string {
  const types = typevalues.map((typevalue) =>
    typevalue.type === 'bytes' && forSignature ? 'bytes32' : typevalue.type,
  );
  const values = typevalues.map((typevalue) =>
    typevalue.type === 'bytes' && forSignature ? keccak256(typevalue.val) : typevalue.val,
  );
  return defaultAbiCoder.encode(types, values);
}

// reverse "Deferrable" or "PromiseOrValue" fields
export type NotPromise<T> = {
  [P in keyof T]: Exclude<T[P], Promise<any>>
}

/**
 * pack the userOperation
 * @param op
 * @param forSignature "true" if the hash is needed to calculate the getUserOpHash()
 *  "false" to pack entire UserOp, for calculating the calldata cost of putting it on-chain.
 */
export function packUserOp (op: NotPromise<UserOperationStruct>, forSignature = true): string {
  if (forSignature) {
    return defaultAbiCoder.encode(
      ['address', 'uint256', 'bytes32', 'bytes32',
        'uint256', 'uint256', 'uint256', 'uint256', 'uint256',
        'bytes32'],
      [op.sender, op.nonce, keccak256(op.initCode), keccak256(op.callData),
        op.callGasLimit, op.verificationGasLimit, op.preVerificationGas, op.maxFeePerGas, op.maxPriorityFeePerGas,
        keccak256(op.paymasterAndData)])
  } else {
    // for the purpose of calculating gas cost encode also signature (and no keccak of bytes)
    return defaultAbiCoder.encode(
      ['address', 'uint256', 'bytes', 'bytes',
        'uint256', 'uint256', 'uint256', 'uint256', 'uint256',
        'bytes', 'bytes'],
      [op.sender, op.nonce, op.initCode, op.callData,
        op.callGasLimit, op.verificationGasLimit, op.preVerificationGas, op.maxFeePerGas, op.maxPriorityFeePerGas,
        op.paymasterAndData, op.signature])
  }
}

/**
 * calculate the userOpHash of a given userOperation.
 * The userOpHash is a hash of all UserOperation fields, except the "signature" field.
 * The entryPoint uses this value in the emitted UserOperationEvent.
 * A wallet may use this value as the hash to sign (the SampleWallet uses this method)
 * @param op
 * @param entryPoint
 * @param chainId
 */
export function getUserOpHash(op: NotPromise<UserOperationStruct>, entryPoint: string, chainId: number): string {
  const userOpHash = keccak256(packUserOp(op, true));
  const enc = defaultAbiCoder.encode(['bytes32', 'address', 'uint256'], [userOpHash, entryPoint, chainId]);
  return keccak256(enc);
}

const ErrorSig = keccak256(Buffer.from('Error(string)')).slice(0, 10); // 0x08c379a0
const FailedOpSig = keccak256(Buffer.from('FailedOp(uint256,string)')).slice(0, 10); // 0x220266b6

interface DecodedError {
  message: string;
  opIndex?: number;
}

/**
 * decode bytes thrown by revert as Error(message) or FailedOp(opIndex,paymaster,message)
 */
export function decodeErrorReason(error: string): DecodedError | undefined {
  if (error.startsWith(ErrorSig)) {
    const [message] = defaultAbiCoder.decode(['string'], '0x' + error.substring(10));
    return { message };
  } else if (error.startsWith(FailedOpSig)) {
    const [opIndex, message] = defaultAbiCoder.decode(['uint256', 'string'], '0x' + error.substring(10));
    const formattedMessage = `FailedOp: ${message as string}`;
    return {
      message: formattedMessage,
      opIndex,
    };    
  }
}

/**
 * update thrown Error object with our custom FailedOp message, and re-throw it.
 * updated both "message" and inner encoded "data"
 * tested on geth, hardhat-node
 * usage: entryPoint.handleOps().catch(decodeError)
 */
export function rethrowError(e: any): any {
  let error = e;
  let parent = e;
  if (error?.error != null) {
    error = error.error;
  }
  while (error?.data != null) {
    parent = error;
    error = error.data;
  }
  const decoded = typeof error === 'string' && error.length > 2 ? decodeErrorReason(error) : undefined;
  if (decoded != null) {
    e.message = decoded.message;

    if (decoded.opIndex != null) {
      // helper for chai: convert our FailedOp error into "Error(msg)"
      const errorWithMsg = hexConcat([ErrorSig, defaultAbiCoder.encode(['string'], [decoded.message])]);
      // modify in-place the error object:
      parent.data = errorWithMsg;
    }
  }
  throw e;
}

/**
 * hexlify all members of object, recursively
 * @param obj
 */
export function deepHexlify(obj: any): any {
  if (typeof obj === 'function') {
    return undefined;
  }
  if (obj == null || typeof obj === 'string' || typeof obj === 'boolean') {
    return obj;
  } else if (obj._isBigNumber != null || typeof obj !== 'object') {
    return hexlify(obj).replace(/^0x0/, '0x');
  }
  if (Array.isArray(obj)) {
    return obj.map((member) => deepHexlify(member));
  }
  return Object.keys(obj).reduce(
    (set, key) => ({
      ...set,
      [key]: deepHexlify(obj[key]),
    }),
    {},
  );
}

// resolve all property and hexlify.
// (UserOpMethodHandler receives data from the network, so we need to pack our generated values)
export function resolveHexlify(a: any): any {
  return deepHexlify(a);
}
