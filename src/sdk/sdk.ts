import { BehaviorSubject } from 'rxjs';
import { State, StateService } from './state';
import {
  EthereumProvider,
  isWalletConnectProvider,
  isWalletProvider,
  WalletConnect2WalletProvider,
  WalletProviderLike
} from './wallet';
import { Factory, PaymasterApi, SdkOptions } from './interfaces';
import { Network } from "./network";
import { BatchUserOpsRequest, Exception, getGasFee, onRampApiKey, openUrl, UserOpsRequest } from "./common";
import { BigNumber, ethers, providers } from 'ethers';
import { getNetworkConfig, Networks, onRamperAllNetworks } from './network/constants';
import { UserOperationStruct } from './contracts/account-abstraction/contracts/core/BaseAccount';
import { EtherspotWalletAPI, HttpRpcClient, VerifyingPaymasterAPI } from './base';
import { TransactionDetailsForUserOp, TransactionGasInfoForUserOp } from './base/TransactionDetailsForUserOp';
import { CreateSessionDto, OnRamperDto, GetAccountBalancesDto, GetAdvanceRoutesLiFiDto, GetExchangeCrossChainQuoteDto, GetExchangeOffersDto, GetNftListDto, GetStepTransactionsLiFiDto, GetTransactionDto, SignMessageDto, validateDto, FetchExchangeRatesDto, GetTokenListDto } from './dto';
import { AccountBalances, AdvanceRoutesLiFi, BridgingQuotes, ExchangeOffer, NftList, StepTransactions, Transaction, Session, RateData, TokenListToken, TokenList } from './';
import { ZeroDevWalletAPI } from './base/ZeroDevWalletAPI';
import { SimpleAccountAPI } from './base/SimpleAccountWalletAPI';

/**
 * Prime-Sdk
 *
 * @category Prime-Sdk
 */
export class PrimeSdk {

  private etherspotWallet: EtherspotWalletAPI | ZeroDevWalletAPI | SimpleAccountAPI;
  private bundler: HttpRpcClient;
  private chainId: number;
  private factoryUsed: Factory;

  private userOpsBatch: BatchUserOpsRequest = { to: [], data: [], value: [] };

  constructor(walletProvider: WalletProviderLike, optionsLike: SdkOptions) {

    let walletConnectProvider;
    if (isWalletConnectProvider(walletProvider)) {
      walletConnectProvider = new WalletConnect2WalletProvider(walletProvider as EthereumProvider);
    } else if (!isWalletProvider(walletProvider)) {
      throw new Exception('Invalid wallet provider');
    }

    const {
      chainId, //
      rpcProviderUrl,
    } = optionsLike;

    this.chainId = chainId;

    if (!optionsLike.bundlerRpcUrl) {
      const networkConfig = getNetworkConfig(chainId);
      optionsLike.bundlerRpcUrl = networkConfig.bundler;
      if (optionsLike.bundlerRpcUrl == '') throw new Exception('No bundler Rpc provided');
      optionsLike.graphqlEndpoint = networkConfig.graphqlEndpoint;
    }

    this.factoryUsed = optionsLike.factoryWallet ?? Factory.ETHERSPOT;

    let provider;

    if (rpcProviderUrl) {
      provider = new providers.JsonRpcProvider(rpcProviderUrl);
    } else provider = new providers.JsonRpcProvider(optionsLike.bundlerRpcUrl);

    if (Networks[chainId].contracts.walletFactory[this.factoryUsed] == '') throw new Exception('The selected factory is not deployed in the selected chain_id')

    if (this.factoryUsed === Factory.ZERO_DEV) {
      this.etherspotWallet = new ZeroDevWalletAPI({
        provider,
        walletProvider: walletConnectProvider ?? walletProvider,
        optionsLike,
        entryPointAddress: Networks[chainId].contracts.entryPoint,
        factoryAddress: Networks[chainId].contracts.walletFactory[this.factoryUsed],
      })
    } else if (this.factoryUsed === Factory.SIMPLE_ACCOUNT) {
      this.etherspotWallet = new SimpleAccountAPI({
        provider,
        walletProvider: walletConnectProvider ?? walletProvider,
        optionsLike,
        entryPointAddress: Networks[chainId].contracts.entryPoint,
        factoryAddress: Networks[chainId].contracts.walletFactory[this.factoryUsed],
      })
    }
    else {
      this.etherspotWallet = new EtherspotWalletAPI({
        provider,
        walletProvider: walletConnectProvider ?? walletProvider,
        optionsLike,
        entryPointAddress: Networks[chainId].contracts.entryPoint,
        factoryAddress: Networks[chainId].contracts.walletFactory[this.factoryUsed],
      })
    }
    this.bundler = new HttpRpcClient(optionsLike.bundlerRpcUrl, Networks[chainId].contracts.entryPoint, Networks[chainId].chainId);

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

  async estimate(paymasterDetails?: PaymasterApi, gasDetails?: TransactionGasInfoForUserOp) {
    if (this.userOpsBatch.to.length < 1) {
      throw new Error("cannot sign empty transaction");
    }

    if (paymasterDetails?.url) {
      const paymasterAPI = new VerifyingPaymasterAPI(paymasterDetails.url, Networks[this.chainId].contracts.entryPoint, paymasterDetails.context ?? {}, paymasterDetails.api_key, this.chainId)
      this.etherspotWallet.setPaymasterApi(paymasterAPI)
    } else this.etherspotWallet.setPaymasterApi(null);

    const tx: TransactionDetailsForUserOp = {
      target: this.userOpsBatch.to,
      values: this.userOpsBatch.value,
      data: this.userOpsBatch.data,
      ...gasDetails,
    }

    const partialtx = await this.etherspotWallet.createUnsignedUserOp({
      ...tx,
      maxFeePerGas: 1,
      maxPriorityFeePerGas: 1,
    });

    /**
     * Dummy signature used only in the case of zeroDev factory contract
     */
    if (this.factoryUsed === Factory.ZERO_DEV) {
      partialtx.signature = "0x00000000870fe151d548a1c527c3804866fab30abf28ed17b79d5fc5149f19ca0819fefc3c57f3da4fdf9b10fab3f2f3dca536467ae44943b9dbb8433efe7760ddd72aaa1c"
    }

    const bundlerGasEstimate = await this.bundler.getVerificationGasInfo(partialtx);

    // if user has specified the gas prices then use them
    if (gasDetails?.maxFeePerGas && gasDetails?.maxPriorityFeePerGas) {
      partialtx.maxFeePerGas = gasDetails.maxFeePerGas;
      partialtx.maxPriorityFeePerGas = gasDetails.maxPriorityFeePerGas;
    }
    // if estimation has gas prices use them, otherwise fetch them in a separate call
    else if (bundlerGasEstimate.maxFeePerGas && bundlerGasEstimate.maxPriorityFeePerGas) {
      partialtx.maxFeePerGas = bundlerGasEstimate.maxFeePerGas;
      partialtx.maxPriorityFeePerGas = bundlerGasEstimate.maxPriorityFeePerGas;
    } else {
      const gas = await this.getGasFee();
      partialtx.maxFeePerGas = gas.maxFeePerGas;
      partialtx.maxPriorityFeePerGas = gas.maxPriorityFeePerGas;
    }

    if (bundlerGasEstimate.preVerificationGas) {
      partialtx.preVerificationGas = BigNumber.from(bundlerGasEstimate.preVerificationGas);
      partialtx.verificationGasLimit = BigNumber.from(bundlerGasEstimate.verificationGasLimit ?? bundlerGasEstimate.verificationGas);
      partialtx.callGasLimit = BigNumber.from(bundlerGasEstimate.callGasLimit);
    }

    return partialtx;

  }

  async getGasFee() {
    const version = await this.bundler.getBundlerVersion();
    if (version.includes('skandha'))
      return this.bundler.getSkandhaGasPrice();
    return getGasFee(this.etherspotWallet.provider as providers.JsonRpcProvider);
  }

  async send(userOp: UserOperationStruct) {
    const signedUserOp = await this.etherspotWallet.signUserOp(userOp);
    return this.bundler.sendUserOpToBundler(signedUserOp);
  }

  async getNativeBalance() {
    if (!this.etherspotWallet.accountAddress) {
      await this.getCounterFactualAddress();
    }
    const balance = await this.etherspotWallet.provider.getBalance(this.etherspotWallet.accountAddress);
    return ethers.utils.formatEther(balance);
  }

  async getUserOpReceipt(userOpHash: string) {
    return this.bundler.getUserOpsReceipt(userOpHash);
  }

  async getUserOpHash(userOp: UserOperationStruct) {
    return this.etherspotWallet.getUserOpHash(userOp);
  }

  async addUserOpsToBatch(
    tx: UserOpsRequest,
  ): Promise<BatchUserOpsRequest> {
    if (!tx.data && !tx.value) throw new Error('Data and Value both cannot be empty');
    if (tx.value && this.factoryUsed === Factory.SIMPLE_ACCOUNT && this.userOpsBatch.value.length > 0) throw new Error('SimpleAccount: native transfers cant be part of batch');
    this.userOpsBatch.to.push(tx.to);
    this.userOpsBatch.value.push(tx.value ?? BigNumber.from(0));
    this.userOpsBatch.data.push(tx.data ?? '0x');
    return this.userOpsBatch;
  }

  async clearUserOpsFromBatch(): Promise<void> {
    this.userOpsBatch.to = [];
    this.userOpsBatch.data = [];
    this.userOpsBatch.value = [];
  }

  async getAccountContract() {
    return this.etherspotWallet._getAccountContract();
  }

  async totalGasEstimated(userOp: UserOperationStruct): Promise<BigNumber> {
    const callGasLimit = BigNumber.from(await userOp.callGasLimit);
    const verificationGasLimit = BigNumber.from(await userOp.verificationGasLimit);
    const preVerificationGas = BigNumber.from(await userOp.preVerificationGas);
    return callGasLimit.add(verificationGasLimit).add(preVerificationGas);
  }

  async getFiatOnRamp(params: OnRamperDto = {}) {
    if (!params.onlyCryptoNetworks) params.onlyCryptoNetworks = onRamperAllNetworks.join(',');
    else {
      const networks = params.onlyCryptoNetworks.split(',');
      for (const network in networks) {
        if (!onRamperAllNetworks.includes(network)) throw new Error('Included Networks which are not supported. Please Check');
      }
    }

    const url = `https://buy.onramper.com/?networkWallets=ETHEREUM:${await this.getCounterFactualAddress()}` +
      `&apiKey=${onRampApiKey}` +
      `&onlyCryptoNetworks=${params.onlyCryptoNetworks}` +
      `${params.defaultCrypto ? `&defaultCrypto=${params.defaultCrypto}` : ``}` +
      `${params.excludeCryptos ? `&excludeCryptos=${params.excludeCryptos}` : ``}` +
      `${params.onlyCryptos ? `&onlyCryptos=${params.onlyCryptos}` : ``}` +
      `${params.excludeCryptoNetworks ? `&excludeCryptoNetworks=${params.excludeCryptoNetworks}` : ``}` +
      `${params.defaultAmount ? `&defaultCrypto=${params.defaultAmount}` : ``}` +
      `${params.defaultFiat ? `&defaultFiat=${params.defaultFiat}` : ``}` +
      `${params.isAmountEditable ? `&isAmountEditable=${params.isAmountEditable}` : ``}` +
      `${params.onlyFiats ? `&onlyFiats=${params.onlyFiats}` : ``}` +
      `${params.excludeFiats ? `&excludeFiats=${params.excludeFiats}` : ``}` +
      `&themeName=${params.themeName ?? 'dark'}`;

    if (typeof window === 'undefined') {
      openUrl(url);
    } else {
      window.open(url);
    }

    return url;
  }

  /**
 * gets account balances
 * @param dto
 * @return Promise<AccountBalances>
 */
  async getAccountBalances(dto: GetAccountBalancesDto = {}): Promise<AccountBalances> {
    const { account, tokens, chainId, provider } = await validateDto(dto, GetAccountBalancesDto, {
      addressKeys: ['account', 'tokens'],
    });

    await this.etherspotWallet.require({
      wallet: !account,
    });

    const ChainId = chainId ? chainId : this.etherspotWallet.services.walletService.chainId;

    return this.etherspotWallet.services.dataService.getAccountBalances(
      this.etherspotWallet.prepareAccountAddress(account),
      tokens,
      ChainId,
      provider,
    );
  }

  /**
 * gets transaction
 * @param dto
 * @return Promise<Transaction>
 */
  async getTransaction(dto: GetTransactionDto): Promise<Transaction> {
    const { hash } = await validateDto(dto, GetTransactionDto);

    await this.etherspotWallet.require({
      wallet: false,
    });

    return this.etherspotWallet.services.dataService.getTransaction(hash);
  }

  /**
  * gets NFT list belonging to account
  * @param dto
  * @return Promise<NftList>
  */
  async getNftList(dto: GetNftListDto): Promise<NftList> {
    const { account, chainId } = await validateDto(dto, GetNftListDto, {
      addressKeys: ['account'],
    });

    await this.etherspotWallet.require({
      wallet: !account,
    });

    const ChainId = chainId ? chainId : this.etherspotWallet.services.walletService.chainId;

    return this.etherspotWallet.services.dataService.getNftList(
      this.etherspotWallet.prepareAccountAddress(account),
      ChainId,
    );
  }

  /**
 * gets exchange offers
 * @param dto
 * @return Promise<ExchangeOffer[]>
 */
  async getExchangeOffers(dto: GetExchangeOffersDto): Promise<ExchangeOffer[]> {
    const { fromTokenAddress, toTokenAddress, fromAmount, fromChainId, showZeroUsd } = await validateDto(dto, GetExchangeOffersDto, {
      addressKeys: ['fromTokenAddress', 'toTokenAddress'],
    });

    let { toAddress, fromAddress } = dto;

    if (!fromAddress) fromAddress = await this.getCounterFactualAddress();

    if (!toAddress) toAddress = fromAddress;

    this.etherspotWallet.services.accountService.joinContractAccount(fromAddress);

    await this.etherspotWallet.require({
      contractAccount: true,
    });

    let { chainId } = this.etherspotWallet.services.walletService;
    chainId = fromChainId ? fromChainId : chainId;

    return this.etherspotWallet.services.dataService.getExchangeOffers(
      fromTokenAddress,
      toTokenAddress,
      BigNumber.from(fromAmount),
      chainId,
      toAddress,
      fromAddress,
      showZeroUsd,
    );
  }

  async getAdvanceRoutesLiFi(dto: GetAdvanceRoutesLiFiDto): Promise<AdvanceRoutesLiFi> {
    const {
      fromChainId,
      toChainId,
      fromTokenAddress,
      toTokenAddress,
      fromAmount,
      allowSwitchChain,
      showZeroUsd,
    } = await validateDto(dto, GetAdvanceRoutesLiFiDto, {
      addressKeys: ['fromTokenAddress', 'toTokenAddress'],
    });

    let { toAddress, fromAddress } = dto;

    if (!fromAddress) fromAddress = await this.getCounterFactualAddress();
    if (!toAddress) toAddress = fromAddress;

    let { chainId } = this.etherspotWallet.services.walletService;
    chainId = fromChainId ? fromChainId : chainId;

    const data = await this.etherspotWallet.services.dataService.getAdvanceRoutesLiFi(
      fromTokenAddress,
      toTokenAddress,
      chainId,
      toChainId,
      BigNumber.from(fromAmount),
      toAddress,
      allowSwitchChain,
      fromAddress,
      showZeroUsd,
    );

    return data;
  }

  async getStepTransaction(dto: GetStepTransactionsLiFiDto): Promise<StepTransactions> {
    const accountAddress = await this.getCounterFactualAddress();

    return this.etherspotWallet.services.dataService.getStepTransaction(dto.route, accountAddress);
  }

  /**
 * gets multi chain quotes
 * @param dto
 * @return Promise<MutliChainQuotes>
 */
  async getCrossChainQuotes(dto: GetExchangeCrossChainQuoteDto): Promise<BridgingQuotes> {
    const {
      fromChainId,
      toChainId,
      fromTokenAddress,
      toTokenAddress,
      fromAmount,
      serviceProvider,
      lifiBridges,
      toAddress,
      showZeroUsd,
    } = await validateDto(dto, GetExchangeCrossChainQuoteDto, {
      addressKeys: ['fromTokenAddress', 'toTokenAddress'],
    });

    let { fromAddress } = dto;

    if (!fromAddress) fromAddress = await this.getCounterFactualAddress();

    let { chainId } = this.etherspotWallet.services.walletService;

    chainId = fromChainId ? fromChainId : chainId;

    return this.etherspotWallet.services.dataService.getCrossChainQuotes(
      fromTokenAddress,
      toTokenAddress,
      chainId,
      toChainId,
      BigNumber.from(fromAmount),
      serviceProvider,
      lifiBridges,
      toAddress,
      fromAddress,
      showZeroUsd,
    );
  }

  /**
 * gets token lists
 * @return Promise<TokenList[]>
 */
  async getTokenLists(): Promise<TokenList[]> {
    await this.etherspotWallet.require({
      wallet: false,
    });

    return this.etherspotWallet.services.dataService.getTokenLists();
  }

  /**
 * gets token list tokens
 * @param dto
 * @return Promise<TokenListToken[]>
 */
  async getTokenListTokens(dto: GetTokenListDto = {}): Promise<TokenListToken[]> {
    const { name } = await validateDto(dto, GetTokenListDto);

    await this.etherspotWallet.require({
      wallet: false,
    });

    return this.etherspotWallet.services.dataService.getTokenListTokens(name);
  }

  /**
  * fetch exchange rates of tokens
  * @param dto
  * @return Promise<RateData>
  */
  async fetchExchangeRates(dto: FetchExchangeRatesDto): Promise<RateData> {
    const { tokens, chainId } = dto;
    let data: RateData;
    const promises = [];

    // Create a batch of 50
    const batches = [...Array(Math.ceil(tokens.length / 50))].map(() => tokens.splice(0, 50));
    batches.forEach((batch) => {
      promises.push(this.etherspotWallet.services.dataService.fetchExchangeRates(batch, chainId));
    });

    // Fetch succeded results and merge
    await (Promise as any)
      .allSettled(promises)
      .then((response) =>
        response?.forEach((result) => {
          if (result?.status === 'fulfilled') {
            !data
              ? (data = result.value ? result.value : {})
              : (data.items = result?.value?.items ? [...data.items, ...result.value.items] : [...data.items]);
          }
        }),
      );

    // Return Unique tokens
    if (data && data.items && data.items.length) {
      data.error = ''
      data.errored = false
      data.items = [...new Map(data.items.map(item => [item['address'], item])).values()];
    } else {
      data.items = [];
    }

    return data;
  }
}
