/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { BLS, BLSInterface } from "../BLS";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes8",
        name: "c__618a6e70",
        type: "bytes8",
      },
    ],
    name: "c_618a6e70",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes8",
        name: "c__618a6e70",
        type: "bytes8",
      },
    ],
    name: "c_false618a6e70",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes8",
        name: "c__618a6e70",
        type: "bytes8",
      },
    ],
    name: "c_true618a6e70",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x6101ae610053600b82828239805160001a607314610046577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361061004b5760003560e01c80630fde8e6f1461005057806321a513e414610080578063753ac54d146100b0575b600080fd5b61006a6004803603810190610065919061013e565b6100cc565b6040516100779190610186565b60405180910390f35b61009a6004803603810190610095919061013e565b6100d7565b6040516100a79190610186565b60405180910390f35b6100ca60048036038101906100c5919061013e565b6100de565b005b600060019050919050565b6000919050565b50565b600080fd5b60007fffffffffffffffff00000000000000000000000000000000000000000000000082169050919050565b61011b816100e6565b811461012657600080fd5b50565b60008135905061013881610112565b92915050565b600060208284031215610154576101536100e1565b5b600061016284828501610129565b91505092915050565b60008115159050919050565b6101808161016b565b82525050565b600060208201905061019b6000830184610177565b9291505056fea164736f6c634300080f000a";

type BLSConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BLSConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BLS__factory extends ContractFactory {
  constructor(...args: BLSConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BLS> {
    return super.deploy(overrides || {}) as Promise<BLS>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): BLS {
    return super.attach(address) as BLS;
  }
  connect(signer: Signer): BLS__factory {
    return super.connect(signer) as BLS__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BLSInterface {
    return new utils.Interface(_abi) as BLSInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): BLS {
    return new Contract(address, _abi, signerOrProvider) as BLS;
  }
}