import { BigNumber } from 'ethers';
import { Route } from '@lifi/sdk';
import { ObjectSubject } from '../common';
import { AccountBalances, AdvanceRoutesLiFi, ExchangeOffer, NftList, PaginatedTokens, RateData, StepTransactions, TokenList, TokenListToken, Transaction, Transactions } from './classes';
import { RestApiService } from '../api';
import { API_ENDPOINTS, MethodTypes } from '../api/constants';

export class DataModule {
  readonly apiKey$ = new ObjectSubject<string>('');
  private apiService: RestApiService;

  constructor(apiKey = '') {
    this.apiService = new RestApiService();
    this.switchCurrentApi(apiKey);
  }

  get currentApi(): string {
    return this.apiKey$.value;
  }

  switchCurrentApi(currentApi: string): string {
    this.apiKey$.nextData(currentApi);

    return this.currentApi;
  }

  async getAccountBalances(account: string, tokens: string[], chainId: number, provider?: string): Promise<AccountBalances> {
    try {
      const queryParams = {
        'api-key': this.currentApi,
        account,
        chainId,
        provider,
        tokens: tokens.length ? tokens : []
      };

      const balances: AccountBalances = await this.apiService.makeRequest(API_ENDPOINTS.GET_ACCOUNT_BALANCES, MethodTypes.GET, queryParams);

      return balances;
    } catch (error) {
      throw new Error(error.message || 'Failed to get account balances');
    }
  }

  async getTransaction(hash: string, chainId: number): Promise<Transaction> {
    try {
      const queryParams = {
        'api-key': this.currentApi,
        hash,
        chainId,
      };

      const response = await this.apiService.makeRequest(API_ENDPOINTS.GET_TRANSACTION, MethodTypes.GET, queryParams);

      return response.transaction;
    } catch (error) {
      throw new Error(error.message || 'Failed to get transaction');
    }
  }

  async getTransactions(account: string, chainId: number, page?: number, limit?: number): Promise<Transactions> {
    try {
      const queryParams = {
        'api-key': this.currentApi,
        account,
        chainId,
        page,
        limit,
      };

      const response = await this.apiService.makeRequest(API_ENDPOINTS.GET_TRANSACTIONS, MethodTypes.GET, queryParams);

      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to get transactions');
    }
  }

  async getNftList(account: string, chainId: number): Promise<NftList> {
    try {
      const queryParams = {
        'api-key': this.currentApi,
        account,
        chainId,
      };

      const nfts = await this.apiService.makeRequest(API_ENDPOINTS.GET_ACCOUNT_NFTS, MethodTypes.GET, queryParams);

      return nfts;
    } catch (error) {
      throw new Error(error.message || 'Failed to get nft list');
    }
  }

  async getAdvanceRoutesLiFi(
    fromTokenAddress: string,
    toTokenAddress: string,
    fromChainId: number,
    toChainId: number,
    fromAmount: BigNumber,
    toAddress?: string,
    allowSwitchChain?: boolean,
    fromAddress?: string,
    showZeroUsd?: boolean,
  ): Promise<AdvanceRoutesLiFi> {
    const account = fromAddress;
    let data = null;

    try {
      const queryParams = {
        'api-key': this.currentApi,
        account,
        fromTokenAddress,
        toTokenAddress,
        fromChainId,
        toChainId,
        fromAmount: fromAmount.toString(),
        toAddress,
        allowSwitchChain,
        fromAddress,
        showZeroUsd,
      };

      const response = await this.apiService.makeRequest(API_ENDPOINTS.GET_ADVANCE_ROUTES_LIFI, MethodTypes.GET, queryParams);

      data = JSON.parse(response.data);

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to advance routes from LiFi');
    }
  }

  async getStepTransaction(selectedRoute: Route, account: string): Promise<StepTransactions> {
    try {
      const route = JSON.stringify(selectedRoute);
      const queryParams = {
        'api-key': this.currentApi,
      };

      const body = {
        route,
        account
      };

      const response = await this.apiService.makeRequest(API_ENDPOINTS.GET_STEP_TRANSACTIONS, MethodTypes.POST, queryParams, body);

      return {
        items: response.transactions
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to get step transaction from LIFI');
    }
  }

  async getExchangeSupportedAssets(page: number = null, limit: number = null, chainId: number, account: string): Promise<PaginatedTokens> {
    try {
      const queryParams = {
        'api-key': this.currentApi,
        account,
        page: page || 1,
        limit: limit || 100,
        chainId
      };

      const assets: PaginatedTokens = await this.apiService.makeRequest(API_ENDPOINTS.GET_EXCHANGE_SUPPORTED_ASSETS, MethodTypes.GET, queryParams);

      return assets;
    } catch (error) {
      throw new Error(error.message || 'Failed to get exchange supported assets');
    }
  }

  async getExchangeOffers(
    fromTokenAddress: string,
    toTokenAddress: string,
    fromAmount: BigNumber,
    fromChainId: number,
    fromAddress: string,
    toAddress?: string,
    showZeroUsd?: boolean
  ): Promise<ExchangeOffer[]> {
    const account = fromAddress;

    try {
      const queryParams = {
        'api-key': this.currentApi,
        account,
        fromTokenAddress,
        toTokenAddress,
        fromAmount: fromAmount.toString(),
        chainId: fromChainId,
        fromAddress,
        toAddress,
        showZeroUsd,
      };

      const result = await this.apiService.makeRequest(API_ENDPOINTS.GET_EXCHANGE_OFFERS, MethodTypes.GET, queryParams);

      return result ? result.items : null;
    } catch (error) {
      throw new Error(error.message || 'Failed to get exchange offers');
    }
  }

  async getTokenLists(chainId: number): Promise<TokenList[]> {
    try {
      const queryParams = {
        'api-key': this.currentApi,
        chainId,
      };

      const result = await this.apiService.makeRequest(API_ENDPOINTS.GET_TOKEN_LISTS, MethodTypes.GET, queryParams);

      return result ? result.items : [];
    } catch (error) {
      throw new Error(error.message || 'Failed to get token lists');
    }
  }

  async getTokenListTokens(chainId: number, name: string = null): Promise<TokenListToken[]> {
    try {
      const queryParams = {
        'api-key': this.currentApi,
        chainId,
        name,
      };

      const result = await this.apiService.makeRequest(API_ENDPOINTS.GET_TOKEN_LIST_TOKENS, MethodTypes.GET, queryParams);

      return result ? result.tokens : [];
    } catch (error) {
      throw new Error(error.message || 'Failed to get token list tokens');
    }
  }

  async fetchExchangeRates(tokens: string[], chainId: number): Promise<RateData> {
    try {
      const queryParams = {
        'api-key': this.currentApi,
        chainId,
        tokens,
      };

      const result = await this.apiService.makeRequest(API_ENDPOINTS.EXCHANGE_RATES, MethodTypes.GET, queryParams);

      return result ? result.exchangeRates : null;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch exchange rates');
    }
  }
}
