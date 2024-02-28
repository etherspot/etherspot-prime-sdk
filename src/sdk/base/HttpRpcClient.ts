import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { resolveProperties } from 'ethers/lib/utils';
import { UserOperationStruct } from '../contracts/account-abstraction/contracts/core/BaseAccount';
import Debug from 'debug';
import { deepHexlify } from '../common/ERC4337Utils';
import { Gas } from '../common';
import { ErrorHandler } from '../errorHandler/errorHandler.service';

const debug = Debug('aa.rpc');

export class HttpRpcClient {
  private readonly userOpJsonRpcProvider: JsonRpcProvider;

  initializing: Promise<void>;

  constructor(readonly bundlerUrl: string, readonly entryPointAddress: string, readonly chainId: number) {
    try {
      this.userOpJsonRpcProvider = new ethers.providers.JsonRpcProvider({
        url: this.bundlerUrl
      }, {
        name: 'Connected bundler network',
        chainId,
      });
      this.initializing = this.validateChainId();
    } catch (err) {
      if (err.message.includes('failed response'))
        throw new ErrorHandler(err.message, 2);
      if (err.message.includes('timeout'))
        throw new ErrorHandler(err.message, 3);
      throw new Error(err.message);
    }
  }

  async validateChainId(): Promise<void> {
    try {
      // validate chainId is in sync with expected chainid
      const chain = await this.userOpJsonRpcProvider.send('eth_chainId', []);
      const bundlerChain = parseInt(chain);
      if (bundlerChain !== this.chainId) {
        throw new Error(
          `bundler ${this.bundlerUrl} is on chainId ${bundlerChain}, but provider is on chainId ${this.chainId}`,
        );
      }
    } catch (err) {
      if (err.message.includes('failed response'))
        throw new ErrorHandler(err.message, 400);
      if (err.message.includes('timeout'))
        throw new ErrorHandler(err.message, 404);
      throw new Error(err.message);
    }
  }

  async getVerificationGasInfo(tx: UserOperationStruct): Promise<any> {
    const hexifiedUserOp = deepHexlify(await resolveProperties(tx));
    try {
      const response = await this.userOpJsonRpcProvider.send('eth_estimateUserOperationGas', [hexifiedUserOp, this.entryPointAddress]);
      return response;
    } catch (err) {
      const body = JSON.parse(err.body);
      if (body?.error?.code) {
        throw new ErrorHandler(body.error.message, body.error.code)
      }
      throw new Error(err.message);
    }
  }

  /**
   * send a UserOperation to the bundler
   * @param userOp1
   * @return userOpHash the id of this operation, for getUserOperationTransaction
   */
  async sendUserOpToBundler(userOp1: UserOperationStruct): Promise<string> {
    try {
      await this.initializing;
      const hexifiedUserOp = deepHexlify(await resolveProperties(userOp1));
      const jsonRequestData: [UserOperationStruct, string] = [hexifiedUserOp, this.entryPointAddress];
      await this.printUserOperation('eth_sendUserOperation', jsonRequestData);
      return await this.userOpJsonRpcProvider.send('eth_sendUserOperation', [hexifiedUserOp, this.entryPointAddress]);
    } catch (err) {
      const body = JSON.parse(err.body);
      if (body?.error?.code) {
        throw new ErrorHandler(body.error.message, body.error.code)
      }
      throw new Error(err);
    }
  }

  async sendAggregatedOpsToBundler(userOps1: UserOperationStruct[]): Promise<string> {
    try {
      const hexifiedUserOps = await Promise.all(userOps1.map(async (userOp1) => await resolveProperties(userOp1)));
      return await this.userOpJsonRpcProvider.send('eth_sendAggregatedUserOperation', [
        hexifiedUserOps,
        this.entryPointAddress,
      ]);
    } catch (err) {
      const body = JSON.parse(err.body);
      if (body?.error?.code) {
        throw new ErrorHandler(body.error.message, body.error.code)
      }
      throw new Error(err);
    }
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
    try {
      const version = await this.userOpJsonRpcProvider.send('web3_clientVersion', []);
      return version;
    } catch (err) {
      return null;
    }
  }

  async getUserOpsReceipt(uoHash: string): Promise<any> {
    try {
      const response = await this.userOpJsonRpcProvider.send('eth_getUserOperationReceipt', [uoHash]);
      return response;
    } catch (err) {
      return null;
    }
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
