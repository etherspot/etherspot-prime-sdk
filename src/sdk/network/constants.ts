import { NetworkConfig } from ".";

export enum NetworkNames {
  Mumbai = 'mumbai',
}

export const SupportedNetworks = [80001]

export const NETWORK_NAME_TO_CHAIN_ID: {
  [key: string]: number;
} = {
  [NetworkNames.Mumbai]: 80001,
};

export const Networks: {
  [key: string]: NetworkConfig
} = {
  [80001]: {
    chainId: 80001,
    bundler: 'https://mumbai-bundler.etherspot.io',
    contracts: {
      entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
      walletFactory: '0xBabd8268f9579b05E6042661081eF6015E1d34dE',
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
