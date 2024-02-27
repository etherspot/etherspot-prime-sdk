import "reflect-metadata";
import { AccountBalances, AdvanceRoutesLiFi, NftList, PaginatedTokens, PrimeDataModule, StepTransactions, TokenList, TokenListToken, Transaction } from "./data";
import { GetAccountBalancesDto, GetAdvanceRoutesLiFiDto, GetExchangeSupportedAssetsDto, GetNftListDto, GetStepTransactionsLiFiDto, GetTokenListDto, GetTokenListsDto, GetTransactionDto, validateDto } from "./dto";
import { BigNumber } from "ethers";

export class PrimeDataUtils {
    private primeDataModule: PrimeDataModule;
    constructor(apiKey: string) {
        this.primeDataModule = new PrimeDataModule(apiKey)
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

        return this.primeDataModule.getAccountBalances(
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

        return this.primeDataModule.getTransaction(hash, chainId);
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

        return this.primeDataModule.getNftList(
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

        const data = await this.primeDataModule.getAdvanceRoutesLiFi(
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

        return this.primeDataModule.getStepTransaction(route, account);
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

        return this.primeDataModule.getExchangeSupportedAssets(page, limit, chainId, account);
    }

    /**
    * gets token lists
    * @param dto
    * @return Promise<TokenList[]>
    */
    async getTokenLists(dto: GetTokenListsDto): Promise<TokenList[]> {
        const { chainId } = await validateDto(dto, GetTokenListsDto);

        return this.primeDataModule.getTokenLists(chainId);
    }

    /**
    * gets token list tokens
    * @param dto
    * @return Promise<TokenListToken[]>
    */
    async getTokenListTokens(dto: GetTokenListDto): Promise<TokenListToken[]> {
        const { chainId, name } = await validateDto(dto, GetTokenListDto);

        return this.primeDataModule.getTokenListTokens(chainId, name);
    }
}
