/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type UserOperationStruct = {
  sender: string;
  nonce: BigNumberish;
  initCode: BytesLike;
  callData: BytesLike;
  callGasLimit: BigNumberish;
  verificationGasLimit: BigNumberish;
  preVerificationGas: BigNumberish;
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
  paymasterAndData: BytesLike;
  signature: BytesLike;
};

export type UserOperationStructOutput = [
  string,
  BigNumber,
  string,
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  string
] & {
  sender: string;
  nonce: BigNumber;
  initCode: string;
  callData: string;
  callGasLimit: BigNumber;
  verificationGasLimit: BigNumber;
  preVerificationGas: BigNumber;
  maxFeePerGas: BigNumber;
  maxPriorityFeePerGas: BigNumber;
  paymasterAndData: string;
  signature: string;
};

export interface DepositPaymasterInterface extends utils.Interface {
  functions: {
    "COST_OF_POST()": FunctionFragment;
    "addDepositFor(address,address,uint256)": FunctionFragment;
    "addStake(uint32)": FunctionFragment;
    "addToken(address,address)": FunctionFragment;
    "balances(address,address)": FunctionFragment;
    "deposit()": FunctionFragment;
    "depositInfo(address,address)": FunctionFragment;
    "entryPoint()": FunctionFragment;
    "getDeposit()": FunctionFragment;
    "lockTokenDeposit()": FunctionFragment;
    "oracles(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "postOp(uint8,bytes,uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setEntryPoint(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unlockBlock(address)": FunctionFragment;
    "unlockStake()": FunctionFragment;
    "unlockTokenDeposit()": FunctionFragment;
    "validatePaymasterUserOp((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes),bytes32,uint256)": FunctionFragment;
    "withdrawStake(address)": FunctionFragment;
    "withdrawTo(address,uint256)": FunctionFragment;
    "withdrawTokensTo(address,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "COST_OF_POST",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addDepositFor",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "addStake",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "addToken",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "balances",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "deposit", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "depositInfo",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "entryPoint",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lockTokenDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "oracles", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "postOp",
    values: [BigNumberish, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setEntryPoint",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "unlockBlock", values: [string]): string;
  encodeFunctionData(
    functionFragment: "unlockStake",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "unlockTokenDeposit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "validatePaymasterUserOp",
    values: [UserOperationStruct, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawStake",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTo",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTokensTo",
    values: [string, string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "COST_OF_POST",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addDepositFor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addStake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balances", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "entryPoint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getDeposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lockTokenDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "oracles", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "postOp", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setEntryPoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unlockBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unlockStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unlockTokenDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validatePaymasterUserOp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawStake",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdrawTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawTokensTo",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface DepositPaymaster extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DepositPaymasterInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    COST_OF_POST(overrides?: CallOverrides): Promise<[BigNumber]>;

    addDepositFor(
      token: string,
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addStake(
      unstakeDelaySec: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addToken(
      token: string,
      tokenPriceOracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balances(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    deposit(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositInfo(
      token: string,
      account: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amount: BigNumber; _unlockBlock: BigNumber }
    >;

    entryPoint(overrides?: CallOverrides): Promise<[string]>;

    getDeposit(overrides?: CallOverrides): Promise<[BigNumber]>;

    lockTokenDeposit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    oracles(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    postOp(
      mode: BigNumberish,
      context: BytesLike,
      actualGasCost: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setEntryPoint(
      _entryPoint: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unlockBlock(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    unlockStake(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unlockTokenDeposit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    validatePaymasterUserOp(
      userOp: UserOperationStruct,
      userOpHash: BytesLike,
      maxCost: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { context: string; deadline: BigNumber }>;

    withdrawStake(
      withdrawAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawTo(
      withdrawAddress: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawTokensTo(
      token: string,
      target: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  COST_OF_POST(overrides?: CallOverrides): Promise<BigNumber>;

  addDepositFor(
    token: string,
    account: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addStake(
    unstakeDelaySec: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addToken(
    token: string,
    tokenPriceOracle: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balances(
    arg0: string,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  deposit(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositInfo(
    token: string,
    account: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { amount: BigNumber; _unlockBlock: BigNumber }
  >;

  entryPoint(overrides?: CallOverrides): Promise<string>;

  getDeposit(overrides?: CallOverrides): Promise<BigNumber>;

  lockTokenDeposit(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  oracles(arg0: string, overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  postOp(
    mode: BigNumberish,
    context: BytesLike,
    actualGasCost: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setEntryPoint(
    _entryPoint: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unlockBlock(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  unlockStake(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unlockTokenDeposit(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  validatePaymasterUserOp(
    userOp: UserOperationStruct,
    userOpHash: BytesLike,
    maxCost: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { context: string; deadline: BigNumber }>;

  withdrawStake(
    withdrawAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawTo(
    withdrawAddress: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawTokensTo(
    token: string,
    target: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    COST_OF_POST(overrides?: CallOverrides): Promise<BigNumber>;

    addDepositFor(
      token: string,
      account: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    addStake(
      unstakeDelaySec: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    addToken(
      token: string,
      tokenPriceOracle: string,
      overrides?: CallOverrides
    ): Promise<void>;

    balances(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deposit(overrides?: CallOverrides): Promise<void>;

    depositInfo(
      token: string,
      account: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amount: BigNumber; _unlockBlock: BigNumber }
    >;

    entryPoint(overrides?: CallOverrides): Promise<string>;

    getDeposit(overrides?: CallOverrides): Promise<BigNumber>;

    lockTokenDeposit(overrides?: CallOverrides): Promise<void>;

    oracles(arg0: string, overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    postOp(
      mode: BigNumberish,
      context: BytesLike,
      actualGasCost: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setEntryPoint(
      _entryPoint: string,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    unlockBlock(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    unlockStake(overrides?: CallOverrides): Promise<void>;

    unlockTokenDeposit(overrides?: CallOverrides): Promise<void>;

    validatePaymasterUserOp(
      userOp: UserOperationStruct,
      userOpHash: BytesLike,
      maxCost: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { context: string; deadline: BigNumber }>;

    withdrawStake(
      withdrawAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawTo(
      withdrawAddress: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawTokensTo(
      token: string,
      target: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    COST_OF_POST(overrides?: CallOverrides): Promise<BigNumber>;

    addDepositFor(
      token: string,
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addStake(
      unstakeDelaySec: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addToken(
      token: string,
      tokenPriceOracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balances(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deposit(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositInfo(
      token: string,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    entryPoint(overrides?: CallOverrides): Promise<BigNumber>;

    getDeposit(overrides?: CallOverrides): Promise<BigNumber>;

    lockTokenDeposit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    oracles(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    postOp(
      mode: BigNumberish,
      context: BytesLike,
      actualGasCost: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setEntryPoint(
      _entryPoint: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unlockBlock(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    unlockStake(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unlockTokenDeposit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    validatePaymasterUserOp(
      userOp: UserOperationStruct,
      userOpHash: BytesLike,
      maxCost: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdrawStake(
      withdrawAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawTo(
      withdrawAddress: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawTokensTo(
      token: string,
      target: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    COST_OF_POST(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addDepositFor(
      token: string,
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addStake(
      unstakeDelaySec: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addToken(
      token: string,
      tokenPriceOracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balances(
      arg0: string,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deposit(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositInfo(
      token: string,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    entryPoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getDeposit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lockTokenDeposit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    oracles(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    postOp(
      mode: BigNumberish,
      context: BytesLike,
      actualGasCost: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setEntryPoint(
      _entryPoint: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unlockBlock(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    unlockStake(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unlockTokenDeposit(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    validatePaymasterUserOp(
      userOp: UserOperationStruct,
      userOpHash: BytesLike,
      maxCost: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdrawStake(
      withdrawAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawTo(
      withdrawAddress: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawTokensTo(
      token: string,
      target: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}