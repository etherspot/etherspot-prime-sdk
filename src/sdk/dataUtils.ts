import "reflect-metadata";
import { AccountBalances, AdvanceRoutesLiFi, Token, Quote, TransactionStatus, DataModule, ExchangeOffer, NftList, PaginatedTokens, RateData, StepTransactions, TokenList, TokenListToken, Transaction, Transactions } from "./data";
import { FetchExchangeRatesDto, GetAccountBalancesDto, GetAdvanceRoutesLiFiDto, GetSupportedAssetsDto, GetTransactionStatusDto, GetExchangeOffersDto, GetExchangeSupportedAssetsDto, GetNftListDto, GetStepTransactionsLiFiDto, GetTokenListDto, GetTokenListsDto, GetTransactionDto, GetTransactionsDto, GetQuotesDto, validateDto } from "./dto";
import { BigNumber } from "ethers";

export class DataUtils {
  private dataModule: DataModule;
  private readonly defaultDataApiKey = 'eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjI4ZWJiMGQ5YTMxYjQ3MmY4NmU4MWY2YTVhYzBhMzE1IiwiaCI6Im11cm11cjEyOCJ9';
  constructor(apiKey?: string) {
    this.dataModule = new DataModule(apiKey || this.defaultDataApiKey);
  }

  /**
  * gets account balances
  * @param dto
  * @return Promise<AccountBalances>
  */
  async getAccountBalances(dto: GetAccountBalancesDto): Promise<AccountBalances> {
    const { account, tokens, chainId, provider } = await validateDto(dto, GetAccountBalancesDto, {
      addressKeys: ['account', 'tokens'],
    });

    return this.dataModule.getAccountBalances(
      account,
      tokens,
      chainId,
      provider,
    );
  }

  /**
  * gets transaction
  * @param dto
  * @return Promise<Transaction>
  */
  async getTransaction(dto: GetTransactionDto): Promise<Transaction> {
    const { hash, chainId } = await validateDto(dto, GetTransactionDto);

    return this.dataModule.getTransaction(hash, chainId);
  }

  /**
  * gets transactions
  * @param dto
  * @return Promise<Transactions>
  */
  async getTransactions(dto: GetTransactionsDto): Promise<Transactions> {
    const { account, chainId, page, limit } = await validateDto(dto, GetTransactionsDto, {
      addressKeys: ['account'],
    });

    return this.dataModule.getTransactions(
      account,
      chainId,
      page,
      limit,
    );
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

    return this.dataModule.getNftList(
      account,
      chainId,
    );
  }

  /**
  * gets advance routes from LIFI
  * @param dto
  * @return Promise<AdvanceRoutesLiFi>
  */
  async getAdvanceRoutesLiFi(dto: GetAdvanceRoutesLiFiDto): Promise<AdvanceRoutesLiFi> {
    const {
      fromChainId,
      toChainId,
      fromTokenAddress,
      toTokenAddress,
      fromAmount,
      allowSwitchChain,
      showZeroUsd,
      fromAddress,
    } = await validateDto(dto, GetAdvanceRoutesLiFiDto, {
      addressKeys: ['fromTokenAddress', 'toTokenAddress', 'fromAddress'],
    });

    let { toAddress } = dto;

    if (!toAddress) toAddress = fromAddress;

    const data = await this.dataModule.getAdvanceRoutesLiFi(
      fromTokenAddress,
      toTokenAddress,
      fromChainId,
      toChainId,
      BigNumber.from(fromAmount),
      toAddress,
      allowSwitchChain,
      fromAddress,
      showZeroUsd,
    );

    return data;
  }

  /**
  * gets step transactions from LIFI
  * @param dto
  * @return Promise<StepTransactions>
  */
  async getStepTransaction(dto: GetStepTransactionsLiFiDto): Promise<StepTransactions> {
    const { route, account } = await validateDto(dto, GetStepTransactionsLiFiDto, {
      addressKeys: ['account']
    })

    return this.dataModule.getStepTransaction(route, account);
  }

  /**
  * gets exchange supported tokens
  * @param dto
  * @return Promise<PaginatedTokens>
  */
  async getExchangeSupportedAssets(dto: GetExchangeSupportedAssetsDto): Promise<PaginatedTokens> {
    const { page, limit, chainId, account } = await validateDto(dto, GetExchangeSupportedAssetsDto, {
      addressKeys: ['account']
    });

    return this.dataModule.getExchangeSupportedAssets(page, limit, chainId, account);
  }

  /**
  * gets exchange offers
  * @param dto
  * @return Promise<ExchangeOffer[]>
  */
  async getExchangeOffers(dto: GetExchangeOffersDto): Promise<ExchangeOffer[]> {
    const { fromTokenAddress, toTokenAddress, fromAmount, fromChainId, showZeroUsd, fromAddress } = await validateDto(dto, GetExchangeOffersDto, {
      addressKeys: ['fromTokenAddress', 'toTokenAddress', 'fromAddress'],
    });

    let { toAddress } = dto;

    if (!toAddress) toAddress = fromAddress;

    return this.dataModule.getExchangeOffers(
      fromTokenAddress,
      toTokenAddress,
      BigNumber.from(fromAmount),
      fromChainId,
      fromAddress,
      toAddress,
      showZeroUsd,
    );
  }

  /**
  * gets token lists
  * @param dto
  * @return Promise<TokenList[]>
  */
  async getTokenLists(dto: GetTokenListsDto): Promise<TokenList[]> {
    const { chainId } = await validateDto(dto, GetTokenListsDto);

    return this.dataModule.getTokenLists(chainId);
  }

  /**
  * gets token list tokens
  * @param dto
  * @return Promise<TokenListToken[]>
  */
  async getTokenListTokens(dto: GetTokenListDto): Promise<TokenListToken[]> {
    const { chainId, name } = await validateDto(dto, GetTokenListDto);

    return this.dataModule.getTokenListTokens(chainId, name);
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
      promises.push(this.dataModule.fetchExchangeRates(batch, chainId));
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

  /**
  * gets supported tokens
  * @param dto
  * @return Promise<Token[]>
  */
  async getSupportedAssets(dto: GetSupportedAssetsDto): Promise<Token[]> {
    const { chainId, provider } = await validateDto(dto, GetSupportedAssetsDto);

    return this.dataModule.getSupportedAssets(chainId, provider);
  }

  /**
  * gets quote transactions
  * @param dto
  * @return Promise<Quote[]>
  */
  async getQuotes(dto: GetQuotesDto): Promise<Quote[]> {
    const {
      fromAddress,
      toAddress,
      fromChainId,
      toChainId,
      fromToken,
      fromAmount,
      slippage,
      provider
    } = await validateDto(dto, GetQuotesDto, {
      addressKeys: ['fromAddress', 'toAddress', 'fromToken'],
    });

    return this.dataModule.getQuotes(
      fromAddress,
      toAddress,
      fromChainId,
      toChainId,
      fromToken,
      BigNumber.from(fromAmount),
      slippage,
      provider
    );
  }

  /**
  * gets transaction status
  * @param dto
  * @return Promise<TransactionStatus>
  */
  async getTransactionStatus(dto: GetTransactionStatusDto): Promise<TransactionStatus> {
    const { fromChainId, toChainId, transactionHash, provider } = await validateDto(dto, GetTransactionStatusDto);

    return this.dataModule.getTransactionStatus(fromChainId, toChainId, transactionHash, provider);
  }
}
