# Changelog

## [1.7.0] - 2024-04-10
### New
- Added `getExchangeOffers` endpoint into DataUtils
### Breaking changes
- The type name `UserOpsTransaction` has been changed to `UserOpTransaction`

## [1.6.5] - 2024-04-03
### New
- Added Rootstock testnet and mainnet network support

## [1.6.4] - 2024-03-20
### New
- Added `getTransactions` endpoint into DataUtils
### Breaking changes
- The parameters named `projectKey` and `graphqlEndpoint` have been removed in the PrimeSdk module

## [1.6.3] - 2024-03-19
### New
- Added ArkaPaymaster as a sub-module

## [1.6.2] - 2024-03-15
### Bug Fixes
- Fixed browser-side querystring issue

## [1.6.1] - 2024-03-14
### New
- Added Base Sepolia Network

## [1.6.0] - 2024-03-08
### Bug Fixes
- Passed the dummy signature based on the type of smart wallet account to the paymaster

## [1.5.4] - 2024-03-01
### New
- The `DataUtils` module has been updated to fetch data from REST APIs provided by the new backend
- Added these endpoints into DataUtils: `getAccountBalances`, `getTransaction`, `getNftList`, `getAdvanceRoutesLiFi`, `getStepTransaction`, `getTokenLists`, `getTokenListTokens` and `fetchExchangeRates`
### Breaking changes
- Updated the `DataUtils` module to include a data API key parameter instead of project key and GraphQL endpoint parameters (If the data API key is not provided, it will automatically use the default API key, which has a strict rate limit)
- Added new parameter named `chainId` in `getTokenLists` and `getTokenListTokens` endpoints

## [1.5.3] - 2024-02-28
### Bug Fix
- Added Error Handling on bundler side
### Breaking Changes
- Removed `possibleSolution` parameter from error handling and passed that value into `message` itself and added a new parameter called `rawError` to report what the exact error is

## [1.5.2] - 2024-02-12
### New
- Added `GenericBundler` and `EtherspotBundler` as bundlerProviders and removed bundlerUrl params from SdkOptions

## [1.5.1] - 2024-02-08
### Bug fixes
- Added `key` param on SimpleAccount and ZeroDev wallets

## [1.5.0] - 2024-01-26
### Breaking changes
- Refactored `estimate` method
- Added `key` in `estimate` method to include `key` of semi-abstracted nonce (https://eips.ethereum.org/EIPS/eip-4337#semi-abstracted-nonce-support)

## [1.4.2] - 2024-01-09
### New
- Integrate index nonce in sdkOptions for enabling the creation of multiple accounts under the same owner.

## [1.4.1] - 2023-12-27
### Bug Fixes
- Added an optional parameter called accountAddress in SDKOptions to specify the contract address they wish to connect and added checks to verify that. This one is for users who changed the owner of the contract address 

## [1.4.0]
### Breaking Changes
- Changed the data service to initialise as a seperate entity independent of the primeSdk object
- Removed unnecessary state variables and changed the walletAddress variable name to EOAAddress for better understanding
- Optimised the fetching of accountAddress since before it was fetching from on chain for every request to getCounterFactualAddress from the rpc, now it stores the account address locally in the initialised PrimeSDK object
- Fixed network state variable to output the network which it is connected to

## [1.3.14]
### New
- Added ability to override callDataLimit on estimate step by the user

## [1.3.13] - 2023-11-22
### Bug Fixes
- Removed UnsupportedChainId error and now can add custom network details

## [1.3.12] - 2023-11-17
### New
- Added Klaytn mainnet and Testnet (Baobab)

## [1.3.11] - 2023-11-08
### Breaking Changes
- Removed api_key from estimate function on the sdk and added the same on the queryString, please refer examples/13-paymaster.ts for more info

### Bug Fixes
- Updated paymaster url to accept arka apiKey and chainId as queryString
- Added optional parameters such as entryPointAddress and Factory walletAddress for custom chain interaction
- Bug fixes for handling errors on connecting with custom chain interaction


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
