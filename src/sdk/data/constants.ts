export enum TransactionStatuses {
  Pending = 'Pending',
  Completed = 'Completed',
  Reverted = 'Reverted',
}

export enum TransactionDirections {
  Sender = 'Sender',
  Receiver = 'Receiver',
}

export enum TransactionAssetCategories {
  External = 'external',
  Internal = 'internal',
  Token = 'token',
}

export enum TokenTypes {
  Erc20 = 'Erc20',
  Erc721 = 'Erc721',
  Erc1155 = 'Erc1155',
  Native = 'Native',
  WrappedSupertoken = 'WrappedSupertoken',
}

export enum ExchangeProviders {
  Uniswap = 'Uniswap',
  OneInch = 'OneInch',
  Synthetix = 'Synthetix',
  Sushiswap = 'Sushiswap',
  Honeyswap = 'Honeyswap',
  Paraswap = 'Paraswap',
}

export enum CrossChainServiceProvider {
  SocketV2 = 'SocketV2',
  LiFi = 'LiFi',
  Etherspot = 'Connext',
}

export enum LiFiBridge {
  across = 'across',
  arbitrum = 'arbitrum',
  avalanche = 'avalanche',
  cbridge = 'cbridge',
  connext = 'connext',
  hop = 'hop',
  hyphen = 'hyphen',
  multichain = 'multichain',
  optimism = 'optimism',
  polygon = 'polygon',
  stargate = 'stargate',
}
