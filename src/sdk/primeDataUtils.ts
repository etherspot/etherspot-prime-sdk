import "reflect-metadata";
import { AccountBalances, NftList, PrimeDataModule, Transaction } from "./data";
import { GetAccountBalancesDto, GetNftListDto, GetTransactionDto, validateDto } from "./dto";

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
}
