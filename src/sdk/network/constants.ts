import { NetworkConfig } from ".";

export enum NetworkNames {
  Goerli = 'goerli',
  Mumbai = 'mumbai',
  BaseGoerli = 'baseGoerli',
  Sepolia = 'sepolia',
  Optimism = 'optimism',
  Polygon = 'polygon',
  Arbitrum = 'arbitrum',
  ArbitrumGoerli = 'arbitrumGoerli',
  Chiado = 'chiado',
  Fuse = 'fuse',
  FuseSparknet = 'fuseSparknet',
  Gnosis = 'gnosis',
  KromaTestnet = 'kromaTestnet',
  Mainnet = 'mainnet',
  OptimismGoerli = 'optimismGoerli',
  RSKTestnet = 'RSKTestnet',
  VerseTestnet = 'verseTestnet',
}

export const SupportedNetworks = [5, 80001, 84531, 11155111, 10, 137, 42161, 421613, 10200, 122, 123, 100, 2357, 1, 420, 31, 20197 ]

export const NETWORK_NAME_TO_CHAIN_ID: {
  [key: string]: number;
} = {
  [NetworkNames.Goerli]: 5,
  [NetworkNames.Mumbai]: 80001,
  [NetworkNames.BaseGoerli]: 84531,
  [NetworkNames.Sepolia]: 11155111,
  [NetworkNames.Optimism]: 10,
  [NetworkNames.Polygon]: 137,
  [NetworkNames.Arbitrum]: 42161,
  [NetworkNames.ArbitrumGoerli]: 421613,
  [NetworkNames.Chiado]: 10200,
  [NetworkNames.Fuse]: 122,
  [NetworkNames.FuseSparknet]: 123,
  [NetworkNames.Gnosis]: 100,
  [NetworkNames.KromaTestnet]: 2357,
  [NetworkNames.Mainnet]: 1,
  [NetworkNames.OptimismGoerli]: 420,
  [NetworkNames.RSKTestnet]: 31,
  [NetworkNames.VerseTestnet]: 20197,
};

export const Networks: {
  [key: string]: NetworkConfig
} = {
  [5]: {
    chainId: 5,
    bundler: 'https://goerli-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [80001]: {
    chainId: 80001,
    bundler: 'https://mumbai-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [84531]: {
    chainId: 84531,
    bundler: 'https://basegoerli-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [11155111]: {
    chainId: 11155111,
    bundler: 'https://sepolia-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [10]: {
    chainId: 10,
    bundler: 'https://optimism-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [137]: {
    chainId: 137,
    bundler: 'https://polygon-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [42161]: {
    chainId: 42161,
    bundler: 'https://arbitrum-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [1]: {
    chainId: 1,
    bundler: 'https://ethereum-bundler.etherspot.io/',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [421613]: {
    chainId: 421613,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [10200]: {
    chainId: 10200,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [122]: {
    chainId: 122,
    bundler: 'https://fuse-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [123]: {
    chainId: 123,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [100]: {
    chainId: 100,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [2357]: {
    chainId: 2357,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [420]: {
    chainId: 420,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [31]: {
    chainId: 31,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
  [20197]: {
    chainId: 20197,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x2f771DCa6Ffa3879e48355E8A4aF5b81d82A6164',
    },
    paymaster: {
      use: false,
      url: '',
    },
  },
};

export const CHAIN_ID_TO_NETWORK_NAME: { [key: number]: NetworkNames } = Object.entries(
  NETWORK_NAME_TO_CHAIN_ID,
).reduce(
  (result, [networkName, chainId]) => ({
    ...result,
    [chainId]: networkName,
  }),
  {},
);

export function getNetworkConfig(key: number) {
  return Networks[key];
}
