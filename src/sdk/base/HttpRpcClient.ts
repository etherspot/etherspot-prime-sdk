import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { resolveProperties } from 'ethers/lib/utils';
import { UserOperationStruct } from '../contracts/src/aa-4337/core/BaseAccount';
import Debug from 'debug';
import { deepHexlify } from '../common/ERC4337Utils';
import { Gas } from '../common';

const debug = Debug('aa.rpc');

export class HttpRpcClient {
  private readonly userOpJsonRpcProvider: JsonRpcProvider;

  initializing: Promise<void>;

  constructor(readonly bundlerUrl: string, readonly entryPointAddress: string, readonly chainId: number) {
    this.userOpJsonRpcProvider = new ethers.providers.JsonRpcProvider(this.bundlerUrl, {
      name: 'Connected bundler network',
      chainId,
    });
    this.initializing = this.validateChainId();
  }

  async validateChainId(): Promise<void> {
    // validate chainId is in sync with expected chainid
    const chain = await this.userOpJsonRpcProvider.send('eth_chainId', []);
    const bundlerChain = parseInt(chain);
    if (bundlerChain !== this.chainId) {
      throw new Error(
        `bundler ${this.bundlerUrl} is on chainId ${bundlerChain}, but provider is on chainId ${this.chainId}`,
      );
    }
  }

  async getVerificationGasInfo(tx: UserOperationStruct): Promise<any> {
    const hexifiedUserOp = deepHexlify(await resolveProperties(tx));
    const response = await this.userOpJsonRpcProvider.send('eth_estimateUserOperationGas', [hexifiedUserOp, this.entryPointAddress]);
    return response;
  }

  /**
   * send a UserOperation to the bundler
   * @param userOp1
   * @return userOpHash the id of this operation, for getUserOperationTransaction
   */
  async sendUserOpToBundler(userOp1: UserOperationStruct): Promise<string> {
    await this.initializing;
    const hexifiedUserOp = deepHexlify(await resolveProperties(userOp1));
    const jsonRequestData: [UserOperationStruct, string] = [hexifiedUserOp, this.entryPointAddress];
    await this.printUserOperation('eth_sendUserOperation', jsonRequestData);
    return await this.userOpJsonRpcProvider.send('eth_sendUserOperation', [hexifiedUserOp, this.entryPointAddress]);
  }

  async sendAggregatedOpsToBundler(userOps1: UserOperationStruct[]): Promise<string> {
    const hexifiedUserOps = await Promise.all(userOps1.map(async (userOp1) => await resolveProperties(userOp1)));
    return await this.userOpJsonRpcProvider.send('eth_sendAggregatedUserOperation', [
      hexifiedUserOps,
      this.entryPointAddress,
    ]);
  }

  async getSkandhaGasPrice(): Promise<Gas> {
    try {
      const { maxFeePerGas, maxPriorityFeePerGas } = await this.userOpJsonRpcProvider.send('skandha_getGasPrice', []);
      return { maxFeePerGas, maxPriorityFeePerGas };
    } catch (err) {
      console.warn(
        "getGas: skandha_getGasPrice failed, falling back to legacy gas price."
      );
      const gas = await this.userOpJsonRpcProvider.getGasPrice();
      return { maxFeePerGas: gas, maxPriorityFeePerGas: gas };
    }
  }

  async getBundlerVersion(): Promise<string> {
    const version = await this.userOpJsonRpcProvider.send('web3_clientVersion', []);
    return version;
  }

  async getUserOpsReceipt(uoHash: string): Promise<any> {
    const response = await this.userOpJsonRpcProvider.send('eth_getUserOperationReceipt', [uoHash]);
    return response;
  }

  private async printUserOperation(
    method: string,
    [userOp1, entryPointAddress]: [UserOperationStruct, string],
  ): Promise<void> {
    const userOp = await resolveProperties(userOp1);
    debug(
      'sending',
      method,
      {
        ...userOp,
        // initCode: (userOp.initCode ?? '').length,
        // callData: (userOp.callData ?? '').length
      },
      entryPointAddress,
    );
  }
}
