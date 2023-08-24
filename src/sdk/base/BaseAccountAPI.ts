import { ethers, BigNumber, BigNumberish } from 'ethers';
import { BehaviorSubject } from 'rxjs';
import { Provider } from '@ethersproject/providers';
import { EntryPoint, EntryPoint__factory } from '../contracts';
import { UserOperationStruct } from '../contracts/src/aa-4337/core/BaseAccount';
import { TransactionDetailsForUserOp } from './TransactionDetailsForUserOp';
import { resolveProperties } from 'ethers/lib/utils';
import { PaymasterAPI } from './PaymasterAPI';
import { ErrorSubject, Exception, getUserOpHash, NotPromise, packUserOp } from '../common';
import { calcPreVerificationGas, GasOverheads } from './calcPreVerificationGas';
import { AccountService, AccountTypes, ApiService, CreateSessionDto, isWalletProvider, Network, NetworkNames, NetworkService, SdkOptions, Session, SessionService, SignMessageDto, State, StateService, validateDto, WalletProviderLike, WalletService } from '..';
import { Context } from '../context';
import { DataService } from '../data';
import { PaymasterResponse } from './VerifyingPaymasterAPI';

export interface BaseApiParams {
  provider: Provider;
  entryPointAddress: string;
  accountAddress?: string;
  overheads?: Partial<GasOverheads>;
  paymasterAPI?: PaymasterAPI;
  walletProvider: WalletProviderLike, 
  optionsLike?: SdkOptions
}

export interface UserOpResult {
  transactionHash: string;
  success: boolean;
}

/**
 * Base class for all Smart Wallet ERC-4337 Clients to implement.
 * Subclass should inherit 5 methods to support a specific wallet contract:
 *
 * - getAccountInitCode - return the value to put into the "initCode" field, if the account is not yet deployed. should create the account instance using a factory contract.
 * - getNonce - return current account's nonce value
 * - encodeExecute - encode the call from entryPoint through our account to the target contract.
 * - signUserOpHash - sign the hash of a UserOp.
 *
 * The user can use the following APIs:
 * - createUnsignedUserOp - given "target" and "calldata", fill userOp to perform that operation from the account.
 * - createSignedUserOp - helper to call the above createUnsignedUserOp, and then extract the userOpHash and sign it
 */
export abstract class BaseAccountAPI {
  private senderAddress!: string;
  private isPhantom = true;

  readonly services: Context['services'];

  context: Context;

  // entryPoint connected to "zero" address. allowed to make static calls (e.g. to getSenderAddress)
  protected readonly entryPointView: EntryPoint;

  provider: Provider;
  overheads?: Partial<GasOverheads>;
  entryPointAddress: string;
  accountAddress?: string;
  paymasterAPI?: PaymasterAPI;

  /**
   * base constructor.
   * subclass SHOULD add parameters that define the owner (signer) of this wallet
   */
  constructor(params: BaseApiParams) {

    const optionsLike = params.optionsLike;

    if (!isWalletProvider(params.walletProvider)) {
      throw new Exception('Invalid wallet provider');
    }

    // const env = Env.prepare(optionsLike.env);

    const {
      chainId, //
      omitWalletProviderNetworkCheck,
      stateStorage,
      sessionStorage,
      rpcProviderUrl,
      bundlerRpcUrl,
      graphqlEndpoint,
      projectKey,
    } = optionsLike;

    // const { networkOptions } = env;

    this.services = {
      networkService: new NetworkService(chainId),
      walletService: new WalletService(params.walletProvider, {
        omitProviderNetworkCheck: omitWalletProviderNetworkCheck,
        provider: rpcProviderUrl,
      }, bundlerRpcUrl, chainId),
      sessionService: new SessionService({
        storage: sessionStorage,
      }),
      accountService: new AccountService(),
      stateService: new StateService({
        storage: stateStorage,
      }),
      apiService: new ApiService({
        host: graphqlEndpoint,
        useSsl: true,
      }),
      dataService: new DataService(projectKey),
    };

    this.context = new Context(this.services);
    
    // super();
    this.provider = params.provider;
    this.overheads = params.overheads;
    this.entryPointAddress = params.entryPointAddress;
    this.accountAddress = params.accountAddress;
    this.paymasterAPI = params.paymasterAPI;

    // factory "connect" define the contract address. the contract "connect" defines the "from" address.
    this.entryPointView = EntryPoint__factory.connect(params.entryPointAddress, params.provider).connect(
      ethers.constants.AddressZero,
    );

  }

  get state(): StateService {
    return this.services.stateService;
  }

  get state$(): BehaviorSubject<State> {
    return this.services.stateService.state$;
  }

  get error$(): ErrorSubject {
    return this.context.error$;
  }

  get supportedNetworks(): Network[] {
    return this.services.networkService.supportedNetworks;
  }

  // sdk

  /**
   * destroys
   */
   destroy(): void {
    this.context.destroy();
  }

  // wallet

  /**
   * signs message
   * @param dto
   * @return Promise<string>
   */
  async signMessage(dto: SignMessageDto): Promise<string> {
    const { message } = await validateDto(dto, SignMessageDto);

    await this.require({
      network: false,
    });

    return this.services.walletService.signMessage(message);
  }

  // session

  /**
   * creates session
   * @param dto
   * @return Promise<Session>
   */
  async createSession(dto: CreateSessionDto = {}): Promise<Session> {
    const { ttl, fcmToken } = await validateDto(dto, CreateSessionDto);

    await this.require();

    return this.services.sessionService.createSession(ttl, fcmToken);
  }


  // private


  async require(
    options: {
      network?: boolean;
      wallet?: boolean;
      session?: boolean;
      contractAccount?: boolean;
    } = {},
  ): Promise<void> {
    options = {
      network: true,
      wallet: true,
      ...options,
    };

    const { accountService, walletService, sessionService } = this.services;

    if (options.network && !walletService.chainId) {
      throw new Exception('Unknown network');
    }

    if (options.wallet && !walletService.walletAddress) {
      throw new Exception('Require wallet');
    }

    if (options.session) {
      await sessionService.verifySession();
    }

    if (options.contractAccount && (!accountService.account || accountService.account.type !== AccountTypes.Contract)) {
      throw new Exception('Require contract account');
    }
  }

  prepareAccountAddress(account: string = null): string {
    const {
      accountService: { accountAddress },
    } = this.services;
    return account || accountAddress;
  }

  getNetworkChainId(networkName: NetworkNames = null): number {
    let result: number;

    if (!networkName) {
      ({ chainId: result } = this.services.networkService);
    } else {
      const network = this.supportedNetworks.find(({ name }) => name === networkName);

      if (!network) {
        throw new Exception('Unsupported network');
      }

      ({ chainId: result } = network);
    }

    return result;
  }

  async validateResolveName(
    options: {
      network?: number;
      name?: string;
    } = {},
  ): Promise<void> {
    options = {
      ...options,
    };

    const { networkService } = this.services;

    if (options.network && !networkService.chainId) {
      throw new Exception('Unknown network');
    }

    if (!options.name) {
      throw new Exception('Require name');
    }
  }

  async init(): Promise<this> {
    // check EntryPoint is deployed at given address
    if ((await this.provider.getCode(this.entryPointAddress)) === '0x') {
      throw new Error(`entryPoint not deployed at ${this.entryPointAddress}`);
    }

    await this.getAccountAddress();
    return this;
  }

  /**
   * return the value to put into the "initCode" field, if the contract is not yet deployed.
   * this value holds the "factory" address, followed by this account's information
   */
  protected abstract getAccountInitCode(): Promise<string>;

  /**
   * return current account's nonce.
   */
  protected abstract getNonce(): Promise<BigNumber>;

  /**
   * encode the call from entryPoint through our account to the target contract.
   * @param target
   * @param value
   * @param data
   */
  protected abstract encodeExecute(target: string, value: BigNumberish, data: string): Promise<string>;

  protected abstract encodeBatch(targets: string[], values: BigNumberish[], datas: string[]): Promise<string>;

  /**
   * sign a userOp's hash (userOpHash).
   * @param userOpHash
   */
  protected abstract signUserOpHash(userOpHash: string): Promise<string>;

  /**
   * check if the contract is already deployed.
   */
  async checkAccountPhantom(): Promise<boolean> {
    if (!this.isPhantom) {
      // already deployed. no need to check anymore.
      return this.isPhantom;
    }
    const senderAddressCode = await this.provider.getCode(this.getAccountAddress());
    if (senderAddressCode.length > 2) {
      // console.log(`SimpleAccount Contract already deployed at ${this.senderAddress}`)
      this.isPhantom = false;
    } else {
      // console.log(`SimpleAccount Contract is NOT YET deployed at ${this.senderAddress} - working in "phantom account" mode.`)
    }
    return this.isPhantom;
  }

  /**
   * calculate the account address even before it is deployed
   */
  async getCounterFactualAddress(): Promise<string> {
    const initCode = await this.getAccountInitCode();
    // console.log('initCode: ', initCode)
    // use entryPoint to query account address (factory can provide a helper method to do the same, but
    // this method attempts to be generic
    try {
      await this.entryPointView.callStatic.getSenderAddress(initCode);
    } catch (e: any) {
      // console.log(e);
      return e.errorArgs.sender;
    }
    throw new Error('must handle revert');
  }

  /**
   * return initCode value to into the UserOp.
   * (either deployment code, or empty hex if contract already deployed)
   */
  async getInitCode(): Promise<string> {
    if (await this.checkAccountPhantom()) {
      return await this.getAccountInitCode();
    }
    return '0x';
  }

  /**
   * return maximum gas used for verification.
   * NOTE: createUnsignedUserOp will add to this value the cost of creation, if the contract is not yet created.
   */
  async getVerificationGasLimit(): Promise<BigNumberish> {
    return 100000;
  }

  /**
   * should cover cost of putting calldata on-chain, and some overhead.
   * actual overhead depends on the expected bundle size
   */
  async getPreVerificationGas(userOp: Partial<UserOperationStruct>): Promise<number> {
    const p = await resolveProperties(userOp);
    return calcPreVerificationGas(p, this.overheads);
  }

  /**
   * ABI-encode a user operation. used for calldata cost estimation
   */
  packUserOp(userOp: NotPromise<UserOperationStruct>): string {
    return packUserOp(userOp, false);
  }

  async encodeUserOpCallDataAndGasLimit(
    detailsForUserOp: TransactionDetailsForUserOp,
  ): Promise<{ callData: string; callGasLimit: BigNumber }> {
    function parseNumber(a: any): BigNumber | null {
      if (a == null || a === '') return null;
      return BigNumber.from(a.toString());
    }

    const value = parseNumber(detailsForUserOp.value) ?? BigNumber.from(0);
    let callData: string;
    const data = detailsForUserOp.data;
    let target = detailsForUserOp.target;
    if (typeof data === 'string') {
      if (typeof target !== 'string') {
        throw new Error('must have target address if data is single value');
      }
      callData = await this.encodeExecute(target, value, data);
    } else {
      if (typeof target === 'string') {
        target = Array(data.length).fill(target);
      }
      callData = await this.encodeBatch(target, detailsForUserOp.values, data);
    }

    const callGasLimit =
      parseNumber(detailsForUserOp.gasLimit) ?? BigNumber.from(35000)

    return {
      callData,
      callGasLimit,
    };
  }

  /**
   * return userOpHash for signing.
   * This value matches entryPoint.getUserOpHash (calculated off-chain, to avoid a view call)
   * @param userOp userOperation, (signature field ignored)
   */
  async getUserOpHash(userOp: UserOperationStruct): Promise<string> {
    const op = await resolveProperties(userOp);
    const provider = this.services.walletService.getWalletProvider();
    const chainId = await provider.getNetwork().then((net) => net.chainId);
    return getUserOpHash(op, this.entryPointAddress, chainId);
  }

  /**
   * return the account's address.
   * this value is valid even before deploying the contract.
   */
  async getAccountAddress(): Promise<string> {
    if (this.senderAddress == null) {
      if (this.accountAddress != null) {
        this.senderAddress = this.accountAddress;
      } else {
        this.senderAddress = await this.getCounterFactualAddress();
      }
    }
    return this.senderAddress;
  }

  async estimateCreationGas(initCode?: string): Promise<BigNumberish> {
    if (initCode == null || initCode === '0x') return 0;
    const deployerAddress = initCode.substring(0, 42);
    const deployerCallData = '0x' + initCode.substring(42);
    const provider = this.services.walletService.getWalletProvider();
    return await provider.estimateGas({ to: deployerAddress, data: deployerCallData });
  }

  /**
   * create a UserOperation, filling all details (except signature)
   * - if account is not yet created, add initCode to deploy it.
   * - if gas or nonce are missing, read them from the chain (note that we can't fill gaslimit before the account is created)
   * @param info
   */
  async createUnsignedUserOp(info: TransactionDetailsForUserOp): Promise<UserOperationStruct> {
    const { callData, callGasLimit } = await this.encodeUserOpCallDataAndGasLimit(info);
    const initCode = await this.getInitCode();

    const initGas = await this.estimateCreationGas(initCode);
    const verificationGasLimit = BigNumber.from(await this.getVerificationGasLimit()).add(initGas);

    let { maxFeePerGas, maxPriorityFeePerGas } = info;
    if (maxFeePerGas == null || maxPriorityFeePerGas == null) {
      const provider = this.services.walletService.getWalletProvider();
      let feeData: any = {};
      try {
        feeData = await provider.getFeeData();
      } catch (err) {
        console.warn(
          "getGas: eth_maxPriorityFeePerGas failed, falling back to legacy gas price."
        );
        const gas = await provider.getGasPrice();

        feeData = { maxFeePerGas: gas, maxPriorityFeePerGas: gas };
      }
      if (maxFeePerGas == null) {
        maxFeePerGas = feeData.maxFeePerGas ?? undefined;
      }
      if (maxPriorityFeePerGas == null) {
        maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? undefined;
      }
    }

    const partialUserOp: any = {
      sender: await this.getAccountAddress(),
      nonce: await this.getNonce(),
      initCode,
      callData,
      callGasLimit,
      verificationGasLimit,
      maxFeePerGas,
      maxPriorityFeePerGas,
    };


    let paymasterAndData: PaymasterResponse | undefined = null;
    if (this.paymasterAPI != null) {
      // fill (partial) preVerificationGas (all except the cost of the generated paymasterAndData)
      const userOpForPm = {
        ...partialUserOp,
        preVerificationGas: this.getPreVerificationGas(partialUserOp),
      };
      paymasterAndData = (await this.paymasterAPI.getPaymasterAndData(userOpForPm));
      partialUserOp.verificationGasLimit = BigNumber.from(paymasterAndData.verificationGasLimit);
    }
    partialUserOp.paymasterAndData = paymasterAndData ? paymasterAndData.paymasterAndData : '0x';
    return {
      ...partialUserOp,
      preVerificationGas: this.getPreVerificationGas(partialUserOp),
      signature: '0x',
    };
  }

  /**
   * Sign the filled userOp.
   * @param userOp the UserOperation to sign (with signature field ignored)
   */
  async signUserOp(userOp: UserOperationStruct): Promise<UserOperationStruct> {
    if (this.paymasterAPI != null) {
      const paymasterAndData = await this.paymasterAPI.getPaymasterAndData(userOp);
      userOp.paymasterAndData = paymasterAndData.paymasterAndData;
      userOp.verificationGasLimit = BigNumber.from(paymasterAndData.verificationGasLimit);
      userOp.preVerificationGas = paymasterAndData.preVerificationGas;
    }
    const userOpHash = await this.getUserOpHash(userOp);
    const signature = await this.signUserOpHash(userOpHash);
    return {
      ...userOp,
      signature,
    };
  }

  /**
   * helper method: create and sign a user operation.
   * @param info transaction details for the userOp
   */
  async createSignedUserOp(info: TransactionDetailsForUserOp): Promise<UserOperationStruct> {
    return await this.signUserOp(await this.createUnsignedUserOp(info));
  }

  /**
   * get the transaction that has this userOpHash mined, or null if not found
   * @param userOpHash returned by sendUserOpToBundler (or by getUserOpHash..)
   * @param timeout stop waiting after this timeout
   * @param interval time to wait between polls.
   * @return the transactionHash this userOp was mined, or null if not found.
   */
  async getUserOpReceipt(userOpHash: string, timeout = 30000, interval = 5000): Promise<string | null> {
    const endtime = Date.now() + timeout;
    while (Date.now() < endtime) {
      const events = await this.entryPointView.queryFilter(this.entryPointView.filters.UserOperationEvent(userOpHash));
      if (events.length > 0) {
        return events[0].transactionHash;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  }
}
