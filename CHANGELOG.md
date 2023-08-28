# Changelog
## [1.2.0] - 2023-08-28
### Breaking Changes
- Changed the wallet factory address so the smart wallet address will generate a new address. Whoever wishes to access the old wallet should use version 1.1.7 to connect to the old smart wallet

## [1.1.7] - 2023-08-24
### New
- Added getAccountBalances to get account balances
- Added getTransaction to get transaction
- Added getTransactions to get transactions
- Added getNftList to get NFT list belonging to account
- Added getExchangeOffers to get exchange offers
- Added getAdvanceRoutesLiFi to get advance routes
- Added getStepTransaction to get step transaction from LIFI
- Added getCrossChainQuotes to get multi chain quotes
## [1.1.6] - 2023-08-24
### Bug Fixes
- Fixes on User hash was created before initialising the paymaster response if given which leads to "Invalid signature or paymaster signature"

## [1.1.4] - 2023-08-21
### Breaking Changes
- Changed the way of initialising the Paymaster url to string as before it was unreachable code to get VerifyingPaymasterApi class to pass on to the Prime-Sdk
- Changed the response object got from the paymaster to be compatible with our Arka service

## [1.1.2] - 2023-07-31
### New
- Added onRamper to get the url

## [1.1.1] - 2023-07-27
### New
- Added skandha_getGasPrice from the bundler if the bundler url is skandha bundler url

## [1.1.0] - 2023-07-14
### New
- Added Mantle Mainnet config as supported networks
### Breaking Changes
- Changed the wallet factory address so the smart wallet address will generate a new address. Whoever wishes to access the old wallet should use version 1.0.3 to connect to the old smart wallet
- Renamed sign method to estimate and get the return object as UserOps without signature
- Now signing the UserOps is moved into send method so provider would be requested to sign only while calling send method
- getUserOpsReceipt returns the whole object with UserOpsReceipt with transaction Receipt as compared to previously returned transaction hash
- getUserOpsReceipt only returns if the transaction is included into the block on-chain and would give results only for 15k blocks from the latest block number

## [1.0.3] - 2023-07-10
### Fixed
- Fuse and ArbitrumGoerli bundler url and native transfer funds example

## [1.0.2] - 2023-07-07
### New
- Added all supported networks ArbitrumGoerli, Chiado, Fuse, FuseSparknet, Gnosis, KromaTestnet, Mainnet, OptimismGoerli, RSKTestnet, VerseTestnet 🚀

## [1.0.1] - 2023-06-22
### New
- Added all supported networks Goerli, BaseGoerli, Sepolia, Optimism, Polygon and Arbitrum 🚀

## [1.0.0] - 2023-06-01

### New
- Initial version published 🚀
