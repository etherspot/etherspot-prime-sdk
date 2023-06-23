import { NetworkConfig } from ".";

export enum NetworkNames {
  Goerli = 'goerli',
  Mumbai = 'mumbai',
  BaseGoerli = 'baseGoerli',
  Sepolia = 'sepolia',
  Optimism = 'optimism',
  Polygon = 'polygon',
  Arbitrum = 'arbitrum',
}

export const SupportedNetworks = [5, 80001, 84531, 11155111, 10, 137, 42161 ]

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
      uniswapV3SwapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
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
      uniswapV3SwapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
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
      uniswapV3SwapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
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
      uniswapV3SwapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
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
      uniswapV3SwapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
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
      uniswapV3SwapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
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
      uniswapV3SwapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
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
