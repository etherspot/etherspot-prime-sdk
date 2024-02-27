import { ObjectSubject } from '../common';
import { AccountBalances, NftList, Transaction } from './classes';
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
}
