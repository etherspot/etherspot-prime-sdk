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
      entryPoint: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
      walletFactory: '0x8C842380d657fb3826C46D3666e977C7A227cFA6',
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
