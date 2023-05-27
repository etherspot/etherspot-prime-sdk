import { NetworkConfig } from ".";

export enum NetworkNames {
  Mumbai = 'mumbai',
}

export const NETWORK_NAME_TO_CHAIN_ID: {
  [key: string]: number;
} = {
  [NetworkNames.Mumbai]: 80001,
};

export const Networks: {
  [key: string]: NetworkConfig
} = {
  [NetworkNames.Mumbai]: {
    chainId: 80001,
    bundler: 'https://mumbai-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0xD05a6638b11fCf28157f43dAEDb3B541CCfcC7F8',
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
