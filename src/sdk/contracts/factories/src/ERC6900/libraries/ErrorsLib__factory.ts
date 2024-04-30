/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  ErrorsLib,
  ErrorsLibInterface,
} from "../../../../src/ERC6900/libraries/ErrorsLib";

const _abi = [
  {
    inputs: [],
    name: "AlreadyAGuardian",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyAnOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "AlwaysDenyRule",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "revertReason",
        type: "bytes",
      },
    ],
    name: "AuthorizeUpgradeReverted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "plugin",
        type: "address",
      },
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "ExecFromPluginExternalNotPermitted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "plugin",
        type: "address",
      },
      {
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
    ],
    name: "ExecFromPluginNotPermitted",
    type: "error",
  },
  {
    inputs: [],
    name: "GuardianAlreadySignedProposal",
    type: "error",
  },
  {
    inputs: [],
    name: "GuardianCannotBeOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "GuardianProposalResolved",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidConfiguration",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidGuardian",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidGuardianProposalId",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTotalGuardians",
    type: "error",
  },
  {
    inputs: [],
    name: "MultipleOwnerPluginRequired",
    type: "error",
  },
  {
    inputs: [],
    name: "NoValidProposal",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAGuardian",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAnOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAuthorized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "plugin",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "functionId",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "revertReason",
        type: "bytes",
      },
    ],
    name: "PostExecHookReverted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "plugin",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "functionId",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "revertReason",
        type: "bytes",
      },
    ],
    name: "PreExecHookReverted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "plugin",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "functionId",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "revertReason",
        type: "bytes",
      },
    ],
    name: "PreRuntimeValidationHookFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "ProposalTimelockBound",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
    ],
    name: "RuntimeValidationFunctionMissing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "plugin",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "functionId",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "revertReason",
        type: "bytes",
      },
    ],
    name: "RuntimeValidationFunctionReverted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "plugin",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "functionId",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "aggregator",
        type: "address",
      },
    ],
    name: "UnexpectedAggregator",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
    ],
    name: "UnrecognizedFunction",
    type: "error",
  },
  {
    inputs: [],
    name: "UnresolvedGuardianProposal",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
    ],
    name: "UserOpValidationFunctionMissing",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212207e0795d11a7400097ca691701ef417358dbb0b7a5e75b5a040998958ed323ecf64736f6c63430008170033";

type ErrorsLibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ErrorsLibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ErrorsLib__factory extends ContractFactory {
  constructor(...args: ErrorsLibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ErrorsLib> {
    return super.deploy(overrides || {}) as Promise<ErrorsLib>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ErrorsLib {
    return super.attach(address) as ErrorsLib;
  }
  override connect(signer: Signer): ErrorsLib__factory {
    return super.connect(signer) as ErrorsLib__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ErrorsLibInterface {
    return new utils.Interface(_abi) as ErrorsLibInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ErrorsLib {
    return new Contract(address, _abi, signerOrProvider) as ErrorsLib;
  }
}
