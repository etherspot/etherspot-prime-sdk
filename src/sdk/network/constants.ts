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
  Mantle = 'Mantle',
  Avalanche = 'avalanche',
  Base = 'base',
  Bsc = 'bsc',
  BscTestnet = 'bscTestnet',
  Fuji = 'fuji',
  Linea = 'linea',
  LineaTestnet = 'lineaTestnet',
}

export const SupportedNetworks =
  [1, 5, 10, 31, 56, 97, 100, 122, 123, 137, 420, 2357, 5000, 8453, 10200, 20197, 42161, 43113, 43114, 59140, 59144, 80001, 84531, 421613, 11155111]

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
  [NetworkNames.Mantle]: 5000,
  [NetworkNames.Avalanche]: 43114,
  [NetworkNames.Base]: 8453,
  [NetworkNames.Bsc]: 56,
  [NetworkNames.BscTestnet]: 97,
  [NetworkNames.Fuji]: 43113,
  [NetworkNames.Linea]: 59144,
  [NetworkNames.LineaTestnet]: 59140,
};

export const onRamperAllNetworks = ['OPTIMISM', 'POLYGON', 'ARBITRUM', 'FUSE', 'GNOSIS', 'ETHEREUM']

export const Networks: {
  [key: string]: NetworkConfig
} = {
  [5]: {
    chainId: 5,
    bundler: 'https://goerli-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [80001]: {
    chainId: 80001,
    bundler: 'https://mumbai-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [84531]: {
    chainId: 84531,
    bundler: 'https://basegoerli-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [11155111]: {
    chainId: 11155111,
    bundler: 'https://sepolia-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [10]: {
    chainId: 10,
    bundler: 'https://optimism-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: 'etherspot.pillarproject.io',
  },
  [137]: {
    chainId: 137,
    bundler: 'https://polygon-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: 'etherspot.pillarproject.io',
  },
  [42161]: {
    chainId: 42161,
    bundler: 'https://arbitrum-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: 'etherspot.pillarproject.io',
  },
  [1]: {
    chainId: 1,
    bundler: 'https://ethereum-bundler.etherspot.io/',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: 'etherspot.pillarproject.io',
  },
  [421613]: {
    chainId: 421613,
    bundler: 'https://arbitrumgoerli-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [10200]: {
    chainId: 10200,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [122]: {
    chainId: 122,
    bundler: 'https://fuse-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [123]: {
    chainId: 123,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [100]: {
    chainId: 100,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: 'etherspot.pillarproject.io',
  },
  [2357]: {
    chainId: 2357,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [420]: {
    chainId: 420,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [31]: {
    chainId: 31,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [20197]: {
    chainId: 20197,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [5000]: {
    chainId: 5000,
    bundler: 'https://mantle-bundler.etherspot.io/',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E',
    },
    graphqlEndpoint: '',
  },
  [43114]: {
    chainId: 43114,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E'
    },
    graphqlEndpoint: 'etherspot.pillarproject.io'
  },
  [8453]: {
    chainId: 8453,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E'
    },
    graphqlEndpoint: ''
  },
  [56]: {
    chainId: 56,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E'
    },
    graphqlEndpoint: 'etherspot.pillarproject.io'
  },
  [97]: {
    chainId: 97,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E'
    },
    graphqlEndpoint: ''
  },
  [43113]: {
    chainId: 43113,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E'
    },
    graphqlEndpoint: ''
  },
  [59144]: {
    chainId: 59144,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E'
    },
    graphqlEndpoint: ''
  },
  [59140]: {
    chainId: 59140,
    bundler: '',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0x7f6d8F107fE8551160BD5351d5F1514A6aD5d40E'
    },
    graphqlEndpoint: ''
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
