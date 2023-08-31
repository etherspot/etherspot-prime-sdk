import { gql } from '@apollo/client/core';
import { HeaderNames, ObjectSubject, Service } from '../common';
import { Route } from '@lifi/sdk';
import { AccountBalances, AdvanceRoutesLiFi, BridgingQuotes, ExchangeOffer, ExchangeOffers, NftList, StepTransaction, StepTransactions, Transaction, Transactions } from './classes';
import { BigNumber } from 'ethers';
import { CrossChainServiceProvider, LiFiBridge } from './constants';

export class DataService extends Service {
  readonly currentProject$ = new ObjectSubject<string>('');

  constructor(currentProject = '') {
    super();
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
    const { apiService } = this.services;

    const { result } = await apiService.query<{
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

  async getTransaction(hash: string): Promise<Transaction> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: Transaction;
    }>(
      gql`
        query($chainId: Int, $hash: String!) {
          result: transaction(chainId: $chainId, hash: $hash) {
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
          hash,
        },
        models: {
          result: Transaction,
        },
      },
    );

    return result;
  }

  async getTransactions(account: string, ChainId: number): Promise<Transactions> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
      result: Transactions;
    }>(
      gql`
        query($ChainId: Int, $account: String!) {
          result: transactions(chainId: $ChainId, account: $account) {
            items {
              blockNumber
              timestamp
              from
              gasLimit
              gasPrice
              gasUsed
              hash
              logs
              status
              to
              value
              direction
              internalTransactions
              internalTransactionsFetched
              mainTransactionDataFetched
              batch
              asset {
                from
                to
                name
                symbol
                category
                type
                value
                decimal
                contract
              }
              blockExplorerUrl
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
          result: Transactions,
        },
      },
    );

    return result;
  }

  async getNftList(account: string, ChainId: number): Promise<NftList> {
    const { apiService } = this.services;

    const { result } = await apiService.query<{
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

  async getExchangeOffers(
    fromTokenAddress: string,
    toTokenAddress: string,
    fromAmount: BigNumber,
    fromChainId: number,
    toAddress?: string,
    fromAddress?: string,
    showZeroUsd?: boolean,
  ): Promise<ExchangeOffer[]> {
    const { apiService } = this.services;

    const account = fromAddress;

    const { result } = await apiService.query<{
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
    const { apiService } = this.services;

    const account = fromAddress;

    let data = null;

    const { result } = await apiService.query<{
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
    const { apiService } = this.services;

    const account = accountAddress;

    let transactions = [];
    try {
      const route = JSON.stringify(selectedRoute);

      const { result } = await apiService.query<{
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
    const { apiService } = this.services;

    const account = fromAddress;

    const { result } = await apiService.query<{
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
}

