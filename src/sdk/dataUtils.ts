import { BigNumber } from "ethers";
import { AccountBalances, NftList, PaginatedTokens, ExchangeOffer, AdvanceRoutesLiFi, StepTransactions, BridgingQuotes, TokenList, TokenListToken, RateData, Transaction, DataModule } from "./data";
import { GetAccountBalancesDto, validateDto, GetTransactionDto, GetNftListDto, GetExchangeSupportedAssetsDto, GetExchangeOffersDto, GetAdvanceRoutesLiFiDto, GetStepTransactionsLiFiDto, GetExchangeCrossChainQuoteDto, GetTokenListDto, FetchExchangeRatesDto } from "./dto";
import { graphqlEndpoints } from "./interfaces";

export class DataUtils {
    private dataModule: DataModule;
    constructor(projectKey: string, endpoint: graphqlEndpoints) {

      this.dataModule = new DataModule(projectKey, endpoint)
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

  async getStepTransaction(dto: GetStepTransactionsLiFiDto): Promise<StepTransactions> {
    const { route, account } = await validateDto(dto, GetStepTransactionsLiFiDto, {
      addressKeys: ['account']
    })

    return this.dataModule.getStepTransaction(route, account);
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
      fromAddress,
    } = await validateDto(dto, GetExchangeCrossChainQuoteDto, {
      addressKeys: ['fromTokenAddress', 'toTokenAddress', 'fromAddress'],
    });

    return this.dataModule.getCrossChainQuotes(
      fromTokenAddress,
      toTokenAddress,
      fromChainId,
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

    return this.dataModule.getTokenLists();
  }

  /**
 * gets token list tokens
 * @param dto
 * @return Promise<TokenListToken[]>
 */
  async getTokenListTokens(dto: GetTokenListDto = {}): Promise<TokenListToken[]> {
    const { name } = await validateDto(dto, GetTokenListDto);

    return this.dataModule.getTokenListTokens(name);
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
}