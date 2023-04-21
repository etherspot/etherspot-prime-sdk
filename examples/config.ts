import * as dotenv from 'dotenv';

dotenv.config();

export enum NetworkNames {
  Mainnet = 'mainnet',
  Mumbai = 'mumbai',
}

export const NetworkConfig: {
  [key: string]: {
    chainId: number;
    rpcProvider: string;
    bundler: string;
    contracts: {
      entryPoint: string;
      walletFactory: string;
      uniswapV3SwapRouter: string;
    };
    paymaster: {
      use: boolean;
      url: string;
    };
  };
} = {
  [NetworkNames.Mumbai]: {
    chainId: 80001,
    rpcProvider: process.env.RPC_PROVIDER_URL,
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

export function getNetworkConfig(networkName: NetworkNames) {
  const key = networkName.toString();
  const networkConfig = NetworkConfig[key];
  if (!networkConfig) {
    throw new Error(`No network config found for network name '${key}'`);
  }
  return networkConfig;
}
