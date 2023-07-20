# Changelog
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
