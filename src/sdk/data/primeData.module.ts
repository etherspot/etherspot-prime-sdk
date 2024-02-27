import { BigNumber } from 'ethers';
import { Route } from '@lifi/sdk';
import { ObjectSubject } from '../common';
import { AccountBalances, AdvanceRoutesLiFi, NftList, StepTransactions, Transaction } from './classes';
import { RestApiService } from '../api';
import { MethodTypes } from '../api/constants';

export class PrimeDataModule {
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

            const balances: AccountBalances = await this.apiService.makeRequest('account/balances', MethodTypes.GET, queryParams);

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

            const response = await this.apiService.makeRequest('transactions/transaction', MethodTypes.GET, queryParams);

            return response.transaction;
        } catch (error) {
            throw new Error(error.message || 'Failed to get transaction');

        }
    }

    async getNftList(account: string, chainId: number): Promise<NftList> {
        try {
            const queryParams = {
                'api-key': this.currentApi,
                account,
                chainId,
            };

            const nfts = await this.apiService.makeRequest('account/nfts', MethodTypes.GET, queryParams);

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

            const response = await this.apiService.makeRequest('exchange/getAdvanceRoutesLiFi', MethodTypes.GET, queryParams);

            data = JSON.parse(response.data);

            return data;
        } catch (error) {
            throw new Error(error.message || 'Failed to advance routes from LiFi');
        }
    }

    async getStepTransaction(selectedRoute: Route, account: string): Promise<StepTransactions> {
        try {
            const route = JSON.stringify(selectedRoute);
            const body = {
                'api-key': this.currentApi,
                route,
                account
            };

            const response = await this.apiService.makeRequest('exchange/getStepTransactions', MethodTypes.POST, {}, body);

            return {
                items: response.transactions
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to get step transaction from LIFI');
        }
    }
}
