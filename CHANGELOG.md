# Changelog
## [1.3.10] - 2023-10-31
### New
- Added getExchangeSupportedAssets to gets exchange supported tokens

## [1.3.9] - 2023-10-28
### Bug Fixes
- Upgraded Apollo package dependencies
- Updated Error messages with optional possibleSolution parameter for common errors from bundler or Validation Errors on sdk

## [1.3.8] - 2023-10-25
### Bug Fixes
- Added SimpleAccount execute fn in the batch itself and errored when adding more than one transaction if the first transaction is native transfer

## [1.3.7] - 2023-10-25
### Bug Fixes
- If Condition Typo Fix

## [1.3.6] - 2023-10-25
### Bug Fixes
- Added addUserOp fn to execute single transaction since simpleAccount transfers native tokens only using execute fn and does not support in userOp batching

## [1.3.4] - 2023-10-24
### New
- Added BNB (BSC) Testnet bundler url

## [1.3.4] - 2023-10-20
### New
- Added getTokenLists and getTokenListTokens to fetch token details
- Added fetchExchangeRates to fetch exchange rates of tokens

## [1.3.3] - 2023-10-18
### New
- Added Scroll testnet and Mainnet network support

## [1.3.2] - 2023-10-18
### New
- Added Flare testnet and Mainnet network support
- Added an example to execute token paymasters using ARKA

## [1.3.1] - 2023-10-13
### Fixes
- Updated all chains to the latest zeroDev factory contract as previously only goerli chain has the latest factory(0x5de4839a76cf55d0c90e2061ef4386d962E15ae3) and others was on previous factory contract which doesn't work on the latest changes made by zeroDev

## [1.3.0] - 2023-10-12
### New
- Added latest zeroDev wallet Factory(0x5de4839a76cf55d0c90e2061ef4386d962E15ae3) and simpleAccount wallet factory(0x9406Cc6185a346906296840746125a0E44976454)
- Updated network config to include bundler urls deployed

## [1.2.11] - 2023-09-20
### Breaking Changes 
- Removed paymaster initialisation from sdk init place and added to estimate step to specify how each userOp is submitted rather than global paymaster initialisation

## [1.2.10] - 2023-09-27
### Fixes
- Added `buffer` dependency to support both node and browser environments

## [1.2.9] - 2023-09-26
### New
- Added Mantle testnet

## [1.2.8] - 2023-09-21
### Fixes
- Fixed the issue with getExchangeOffers endpoint (Account must need to be deployed to access this endpoint)
- Removed getTransactions endpoint

## [1.2.7] - 2023-09-20
### Fixes
- Fixed the issue on usage of axios when paymaster is called via react native by replacing it to fetch.

## [1.2.6] - 2023-09-12
### Fixes
- Fixed the issue on setting gas prices by the user if specified on estimate step

## [1.2.4] - 2023-09-11
### Breaking Changes
- Changed the paymasterApi to include api_key for ARKA
- Changed paymaster response object to return paymasterAndData, VerificationGasLimit, PreVerificationGas, callGasLimit to set to the userOp before sending to the bundler

## [1.2.2] - 2023-08-31
### Breaking Changes
- Changed the wallet factory address so the smart wallet address will generate a new address. Whoever wishes to access the old wallet should use version 1.2.0 to connect to the old smart wallet

## [1.2.0] - 2023-08-31
### New
- Added wallet connect 2.0 support

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
