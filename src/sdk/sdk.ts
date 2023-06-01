import { BehaviorSubject } from 'rxjs';
import { State, StateService } from './state';
import { isWalletProvider, WalletProviderLike } from './wallet';
import { SdkOptions } from './interfaces';
import { Network } from "./network";
import { Env } from "./env";
import { BatchTransactionRequest, Exception, getGasFee, TransactionRequest } from "./common";
import { BigNumber, BigNumberish, ethers, providers, Wallet } from 'ethers';
import { Networks } from './network/constants';
import { UserOperationStruct } from './contracts/src/aa-4337/core/BaseAccount';
import { EtherspotWalletAPI, HttpRpcClient } from './base';
import { TransactionDetailsForUserOp, TransactionGasInfoForUserOp } from './base/TransactionDetailsForUserOp';
import { CreateSessionDto, SignMessageDto, validateDto } from './dto';
import { Session } from '.';
import { ERC20__factory } from './contracts';
import { ERC20_ABI } from './helpers/abi/ERC20_ABI';

/**
 * Prime-Sdk
 *
 * @category Prime-Sdk
 */
export class PrimeSdk {

  private etherspotWallet: EtherspotWalletAPI;
  private bundler: HttpRpcClient;

  private transactions: BatchTransactionRequest = {to: [], data: [], value: []};

  constructor(walletProvider: WalletProviderLike, optionsLike: SdkOptions) {

    if (!isWalletProvider(walletProvider)) {
      throw new Exception('Invalid wallet provider');
    }

    const env = Env.prepare(optionsLike.env);

    const {
      networkName, //
      rpcProviderUrl,
      bundlerRpcUrl,
    } = optionsLike;


    let provider;

    if (rpcProviderUrl) {
      provider = new providers.JsonRpcProvider(rpcProviderUrl);
    } else provider = new providers.JsonRpcProvider(bundlerRpcUrl);

    this.etherspotWallet = new EtherspotWalletAPI({
      provider,
      walletProvider,
      optionsLike,
      entryPointAddress: Networks[networkName].contracts.entryPoint,
      factoryAddress: Networks[networkName].contracts.walletFactory,
      paymasterAPI: optionsLike.paymasterApi,
    })

    this.bundler = new HttpRpcClient(bundlerRpcUrl, Networks[networkName].contracts.entryPoint, Networks[networkName].chainId);

  }


  // exposes
  get state(): StateService {
    return this.etherspotWallet.services.stateService;
  }

  get state$(): BehaviorSubject<State> {
    return this.etherspotWallet.services.stateService.state$;
  }

  get supportedNetworks(): Network[] {
    return this.etherspotWallet.services.networkService.supportedNetworks;
  }

  /**
   * destroys
   */
  destroy(): void {
    this.etherspotWallet.context.destroy();
  }

  // wallet

  /**
   * signs message
   * @param dto
   * @return Promise<string>
   */
  async signMessage(dto: SignMessageDto): Promise<string> {
    const { message } = await validateDto(dto, SignMessageDto);

    await this.etherspotWallet.require({
      network: false,
    });

    return this.etherspotWallet.services.walletService.signMessage(message);
  }

  // session

  /**
   * creates session
   * @param dto
   * @return Promise<Session>
   */
  async createSession(dto: CreateSessionDto = {}): Promise<Session> {
    const { ttl, fcmToken } = await validateDto(dto, CreateSessionDto);

    await this.etherspotWallet.require();

    return this.etherspotWallet.services.sessionService.createSession(ttl, fcmToken);
  }

  async getCounterFactualAddress(): Promise<string> {
    return this.etherspotWallet.getCounterFactualAddress();
  }


  async depositFromKeyWallet(amount: string, tokenAddress?: string): Promise<string> {
    try {
      const ewalletAddress = await this.getCounterFactualAddress();

      if (tokenAddress) {
        const token = ethers.utils.getAddress(tokenAddress);
        const erc20Contract = ERC20__factory.connect(token, this.etherspotWallet.services.walletService.getWalletProvider());
        const dec = await erc20Contract.functions.decimals();
        const approveData = erc20Contract.interface.encodeFunctionData('approve', [this.state.walletAddress, ethers.utils.parseUnits(amount, dec)])
        const transactionData = erc20Contract.interface.encodeFunctionData('transferFrom', [this.state.walletAddress, ewalletAddress, ethers.utils.parseUnits(amount, dec)])
        const balance = await erc20Contract.functions.balanceOf(ewalletAddress)
        if (balance[0].lt(ethers.utils.parseEther(amount))) {
          
          const approvetx = await this.etherspotWallet.services.walletService.sendTransaction({
            to: tokenAddress, // EtherspotWallet address
            data: approveData, // approval data
            gasLimit: ethers.utils.hexlify(500000),
          });

          await approvetx.wait();

          const tx = await this.etherspotWallet.services.walletService.sendTransaction({
            to: tokenAddress, // EtherspotWallet address
            data: transactionData, // transferFrom data
            gasLimit: ethers.utils.hexlify(500000),
          });
          await tx.wait();
          return `Transfer successful. Account funded with ${amount} ${await erc20Contract.symbol()}`;
        } else {
          return `Sufficient balance already exists. Current balance is ${ethers.utils.formatEther(
            balance[0],
          )} ${await erc20Contract.symbol()}`;
        }
      } else {
        const balance = await this.etherspotWallet.provider.getBalance(ewalletAddress);

        // Check if wallet balance is less than the amount to transfer
        if (balance.lt(ethers.utils.parseEther(amount))) {
          // Transfer funds to the wallet
          const tx = await this.etherspotWallet.services.walletService.sendTransaction({
            to: ewalletAddress, // EtherspotWallet address
            data: '0x', // no data
            value: ethers.utils.parseEther(amount), // 0.1 MATIC
            gasLimit: ethers.utils.hexlify(50000),
          });
          await tx.wait();
          return `Transfer successful. Account funded with ${amount} ${tx}`;
        } else {
          return `Sufficient balance already exists. Current balance is ${ethers.utils.formatEther(balance)}`;
        }
      }
    } catch (e) {
      console.log(e);
      return `Transfer failed: ${e.message}`;
    }
  }

  async sign(gasDetails?: TransactionGasInfoForUserOp) {
    const gas = await this.getGasFee();

    if (this.transactions.to.length < 1){
      throw new Error("cannot sign empty transaction batch");
    }

    const tx: TransactionDetailsForUserOp = {
      target: this.transactions.to,
      values: this.transactions.value,
      data: this.transactions.data,
      ...gasDetails,
    }

    return this.etherspotWallet.createSignedUserOp({
      ...tx,
      ...gas,
    });
  }

  async getGasFee() {
    return getGasFee(this.etherspotWallet.provider as providers.JsonRpcProvider);
  }

  async send(userOp: UserOperationStruct) {
    return this.bundler.sendUserOpToBundler(userOp);
  }

  async getNativeBalance() {
    if (!this.etherspotWallet.accountAddress) {
      await this.getCounterFactualAddress();
    }
    const balance = await this.etherspotWallet.provider.getBalance(this.etherspotWallet.accountAddress);
    return ethers.utils.formatEther(balance);
  }

  async getTokenBalance(tokenAddress: string) {
    if (!this.etherspotWallet.accountAddress) {
      await this.getCounterFactualAddress();
    }
    const token = ethers.utils.getAddress(tokenAddress);
    const erc20Contract = ERC20__factory.connect(token, this.etherspotWallet.services.walletService.getWalletProvider());
    const dec = await erc20Contract.functions.decimals();
    const balance = await erc20Contract.functions.balanceOf(this.etherspotWallet.accountAddress)
    return ethers.utils.formatUnits(balance[0], dec);
  }

  async getUserOpReceipt(userOpHash: string, timeout = 60000, interval = 5000): Promise<string | null> {
    const block = await this.etherspotWallet.provider.getBlock('latest');
    const endtime = Date.now() + timeout;
    while (Date.now() < endtime) {
      const events = await this.etherspotWallet.epView.queryFilter(
        this.etherspotWallet.epView.filters.UserOperationEvent(userOpHash),
        Math.max(100, block.number - 100),
      );
      if (events.length > 0) {
        console.log(events[0].args.actualGasUsed.toString());
        return events[0].transactionHash;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  }

  async getHash(userOp: UserOperationStruct) {
    return this.etherspotWallet.getUserOpHash(userOp);
  }

  async encodeExecute(target: string, value: BigNumberish, data: string): Promise<string> {
    const formatTarget = ethers.utils.getAddress(target);
    return await this.etherspotWallet.encodeExecute(formatTarget, value, data);
  }

  async getUniSingleSwapParams(tokenIn: string, tokenOut: string, value: string) {
    const wallet = await this.getCounterFactualAddress();
    const amount = ethers.utils.parseEther(value);
    const blockNum = await this.etherspotWallet.provider.getBlockNumber();
    const timestamp = (await this.etherspotWallet.provider.getBlock(blockNum)).timestamp;
    const params = {
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      fee: 500,
      recipient: wallet,
      deadline: timestamp + 1000,
      amountIn: amount,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };
    return params;
  }

  async addTransactionToBatch(
    tx: TransactionRequest,
  ): Promise<BatchTransactionRequest> {
    this.transactions.to.push(tx.to);
    this.transactions.value.push(tx.value ?? BigNumber.from(0));
    this.transactions.data.push(tx.data ?? '0x');
    return this.transactions;
  }

  async clearTransactionsFromBatch(): Promise<void> {
    this.transactions.to = [];
    this.transactions.data = [];
    this.transactions.value = [];
  }

  async signSingleTransaction(tx: TransactionDetailsForUserOp) {
    const gas = await this.getGasFee();

    return this.etherspotWallet.createSignedUserOp({
      ...tx,
      ...gas,
    });
  }

  async getAccountContract() {
    return this.etherspotWallet._getAccountContract();
  }

  async getERC20Instance(tokenAddress: string) {
    const token = ethers.utils.getAddress(tokenAddress);
    return new ethers.Contract(token, ERC20_ABI, this.etherspotWallet.provider);
  }

}
