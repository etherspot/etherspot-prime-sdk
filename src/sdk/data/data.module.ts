import { gql } from '@apollo/client/core';
import { HeaderNames, ObjectSubject } from '../common';
import { Route } from '@lifi/sdk';
import { AccountBalances, AdvanceRoutesLiFi, BridgingQuotes, ExchangeOffer, ExchangeOffers, NftList, PaginatedTokens, RateData, StepTransaction, StepTransactions, TokenList, TokenListToken, TokenLists, Transaction } from './classes';
import { BigNumber } from 'ethers';
import { CrossChainServiceProvider, LiFiBridge } from './constants';
import { ApiService } from '../api';

export class DataModule {
  readonly currentProject$ = new ObjectSubject<string>('');
  private apiService: ApiService;
  constructor(currentProject = '', graphqlEndpoint: string) {
    // super();
    this.apiService = new ApiService({
      host: graphqlEndpoint,
      useSsl: true,
      projectKey: currentProject,
    });
    this.switchCurrentProject(currentProject);
  }

  get currentProject(): string {
    return this.currentProject$.value;
  }

  get headers(): { [key: string]: any } {
    let result: { [key: string]: any } = {};
    if (this.currentProject || this.currentProject === '') {
      const key = this.currentProject;

      result = {
        [HeaderNames.ProjectKey]: key,
      }
    }

    return result;
  }

  switchCurrentProject(currentProject: string): string {
    this.currentProject$.nextData(currentProject);

    return this.currentProject;
  }

  async getAccountBalances(account: string, tokens: string[], ChainId: number, provider?: string): Promise<AccountBalances> {

    const { result } = await this.apiService.query<{
      result: AccountBalances;
    }>(
      gql`
        query($ChainId: Int!, $account: String!, $tokens: [String!], $provider: String) {
          result: accountBalances(chainId: $ChainId, account: $account, tokens: $tokens, provider: $provider) {
            items {
              token
              balance
              superBalance
            }
          }
        }
      `,
      {
        variables: {
          account,
          ChainId,
          tokens,
          provider
        },
        models: {
          result: AccountBalances,
        },
      },
    );

    return result;
  }

  async getTransaction(hash: string, ChainId: number): Promise<Transaction> {

    const { result } = await this.apiService.query<{
      result: Transaction;
    }>(
      gql`
        query($ChainId: Int, $hash: String!) {
          result: transaction(chainId: $ChainId, hash: $hash) {
            blockHash
            blockNumber
            from
            gasLimit
            gasPrice
            gasUsed
            hash
            input
            logs
            nonce
            status
            timestamp
            to
            transactionIndex
            value
            blockExplorerUrl
            mainTransactionDataFetched
            internalTransactionsFetched
          }
        }
      `,
      {
        variables: {
          ChainId,
          hash,
        },
        models: {
          result: Transaction,
        },
      },
    );

    return result;
  }

  async getNftList(account: string, ChainId: number): Promise<NftList> {
    
    const { result } = await this.apiService.query<{
      result: NftList;
    }>(
      gql`
        query($ChainId: Int, $account: String!) {
          result: nftList(chainId: $ChainId, account: $account) {
            items {
              contractName
              contractSymbol
              contractAddress
              tokenType
              nftVersion
              nftDescription
              balance
              items {
                tokenId
                name
                amount
                image
                ipfsGateway
              }
            }
          }
        }
      `,
      {
        variables: {
          account,
          ChainId,
        },
        models: {
          result: NftList,
        },
      },
    );

    return result;
  }

  async getExchangeSupportedAssets(page: number = null, limit: number = null, ChainId: number, account: string): Promise<PaginatedTokens> {
    
    try {
      const { result } = await this.apiService.query<{
        result: PaginatedTokens;
      }>(
        gql`
        query($ChainId: Int, $account: String!, $page: Int, $limit: Int) {
          result: exchangeSupportedAssets(chainId: $ChainId, account: $account, page: $page, limit: $limit) {
            items {
              address
              name
              symbol
              decimals
              logoURI
            }
            currentPage
            nextPage
          }
        }
      `,
        {
          variables: {
            account,
            ChainId,
            page: page || 1,
            limit: limit || 100,
          },
          models: {
            result: PaginatedTokens,
          },
        },
      );

      return result;

    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getExchangeOffers(
    fromTokenAddress: string,
    toTokenAddress: string,
    fromAmount: BigNumber,
    fromChainId: number,
    fromAddress: string,
    toAddress?: string,
    showZeroUsd?: boolean,
  ): Promise<ExchangeOffer[]> {

    const account = fromAddress;

    const { result } = await this.apiService.query<{
      result: ExchangeOffers;
    }>(
      gql`
        query(
          $fromChainId: Int!
          $account: String!
          $fromTokenAddress: String!
          $toTokenAddress: String!
          $fromAmount: BigNumber!
          $toAddress: String
          $fromAddress: String
          $showZeroUsd: Boolean
        ) {
          result: exchangeOffers(
            chainId: $fromChainId
            account: $account
            fromTokenAddress: $fromTokenAddress
            toTokenAddress: $toTokenAddress
            fromAmount: $fromAmount
            toAddress: $toAddress
            fromAddress: $fromAddress
            showZeroUsd: $showZeroUsd
          ) {
            items {
              provider
              receiveAmount
              exchangeRate
              transactions {
                to
                data
                value
              }
            }
          }
        }
      `,
      {
        variables: {
          fromChainId,
          account,
          fromTokenAddress,
          toTokenAddress,
          fromAmount,
          toAddress,
          fromAddress,
          showZeroUsd,
        },
        models: {
          result: ExchangeOffers,
        },
      },
    );

    return result ? result.items : null;
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

    const { result } = await this.apiService.query<{
      result: string;
    }>(
      gql`
        query(
          $account: String!
          $fromTokenAddress: String!
          $toTokenAddress: String!
          $fromAmount: BigNumber!
          $fromChainId: Int
          $toChainId: Int
          $toAddress: String
          $allowSwitchChain: Boolean
          $fromAddress: String
          $showZeroUsd: Boolean
        ) {
          result: getAdvanceRoutesLiFi(
            account: $account
            fromTokenAddress: $fromTokenAddress
            toTokenAddress: $toTokenAddress
            fromAmount: $fromAmount
            fromChainId: $fromChainId
            toChainId: $toChainId
            toAddress: $toAddress
            allowSwitchChain: $allowSwitchChain
            fromAddress: $fromAddress
            showZeroUsd: $showZeroUsd
          ) {
            data
          }
        }
      `,
      {
        variables: {
          account,
          fromTokenAddress,
          toTokenAddress,
          fromChainId,
          toChainId,
          fromAmount,
          toAddress,
          allowSwitchChain,
          fromAddress,
          showZeroUsd,
        },
      },
    );

    try {
      data = JSON.parse(result['data']);
    } catch (err) {
      console.log(err)
    }
    return data;
  }

  async getStepTransaction(selectedRoute: Route, accountAddress: string): Promise<StepTransactions> {

    const account = accountAddress;

    let transactions = [];
    try {
      const route = JSON.stringify(selectedRoute);

      const { result } = await this.apiService.query<{
        result: StepTransaction[];
      }>(
        gql`
        query(
          $route: String!
          $account: String!
        ) {
          result: getStepTransactions(
            route: $route
            account: $account
          ) {
              to
              gasLimit
              gasPrice
              data
              value
              chainId
              type
          }
        }`,
        {
          variables: {
            route,
            account,
          },
        }
      );
      transactions = result;
    } catch (err) {
      console.log(err);
    }
    return {
      items: transactions
    };
  }

  async getCrossChainQuotes(
    fromTokenAddress: string,
    toTokenAddress: string,
    fromChainId: number,
    toChainId: number,
    fromAmount: BigNumber,
    serviceProvider?: CrossChainServiceProvider,
    lifiBridges?: LiFiBridge[],
    toAddress?: string,
    fromAddress?: string,
    showZeroUsd?: boolean,
  ): Promise<BridgingQuotes> {

    const account = fromAddress;

    const { result } = await this.apiService.query<{
      result: BridgingQuotes;
    }>(
      gql`
        query(
          $account: String!
          $fromTokenAddress: String!
          $toTokenAddress: String!
          $fromAmount: BigNumber!
          $fromChainId: Int
          $toChainId: Int
          $serviceProvider: CrossChainServiceProvider
          $lifiBridges: [LiFiBridge!]
          $toAddress: String
          $fromAddress: String
          $showZeroUsd: Boolean
        ) {
          result: getCrossChainQuotes(
            account: $account
            fromTokenAddress: $fromTokenAddress
            toTokenAddress: $toTokenAddress
            fromAmount: $fromAmount
            fromChainId: $fromChainId
            toChainId: $toChainId
            serviceProvider: $serviceProvider
            lifiBridges: $lifiBridges
            toAddress: $toAddress
            fromAddress: $fromAddress
            showZeroUsd: $showZeroUsd
          ) {
            items {
              provider
              approvalData {
                approvalAddress
                amount
              }
              transaction {
                data
                to
                value
                from
                chainId
              }
              estimate {
                approvalAddress
                fromAmount
                toAmount
                gasCosts {
                  limit
                  amountUSD
                  token {
                    address
                    symbol
                    decimals
                    logoURI
                    chainId
                    name
                  }
                }
                data {
                  fromToken {
                    address
                    symbol
                    decimals
                    logoURI
                    chainId
                    name
                  }
                  toToken {
                    address
                    symbol
                    decimals
                    logoURI
                    chainId
                    name
                  }
                  toTokenAmount
                  estimatedGas
                }
              }
              LiFiBridgeUsed
            }
          }
        }
      `,
      {
        variables: {
          account,
          fromTokenAddress,
          toTokenAddress,
          fromChainId,
          toChainId,
          fromAmount,
          serviceProvider,
          lifiBridges,
          toAddress,
          fromAddress,
          showZeroUsd,
        },
        models: {
          result: BridgingQuotes,
        },
      },
    );

    return result ? result : null;
  }

  async getTokenLists(chainId: number): Promise<TokenList[]> {

    try {
      const { result } = await this.apiService.query<{
        result: TokenLists;
      }>(
        gql`
        query($chainId: Int) {
          result: tokenLists(chainId: $chainId) {
            items {
              name
              endpoint
              isDefault
              createdAt
              updatedAt
            }
          }
        }
      `,
        {
          variables: {
            chainId,
          },
          models: {
            result: TokenLists,
          },
        },
      );

      return result ? result.items : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getTokenListTokens(chainId: number, name: string = null): Promise<TokenListToken[]> {

    try {
      const { result } = await this.apiService.query<{
        result: TokenList;
      }>(
        gql`
        query($chainId: Int, $name: String) {
          result: tokenList(chainId: $chainId, name: $name) {
            tokens {
              address
              name
              symbol
              decimals
              logoURI
              chainId
            }
          }
        }
      `,
        {
          variables: {
            chainId,
            name,
          },
          models: {
            result: TokenList,
          },
          fetchPolicy: 'cache-first',
        },
      );

      return result ? result.tokens : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async fetchExchangeRates(tokens: string[], ChainId: number): Promise<RateData> {
    try {
      const { result } = await this.apiService.query<{
        result: RateData;
      }>(
        gql`
        query($tokens: [String!]!, $ChainId: Int!) {
          result: fetchExchangeRates(tokens: $tokens, chainId: $ChainId) {
            errored
            error
            items {
              address
              eth
              eur
              gbp
              usd
            }
          }
        }
      `,
        {
          variables: {
            tokens,
            ChainId,
          },
          models: {
            result: RateData,
          },
        },
      );

      return result ?? null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
