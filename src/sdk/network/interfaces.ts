import { NetworkNames } from './constants';

export interface Network {
  name: NetworkNames;
  chainId: number;
}

export interface NetworkConfig {
  chainId: number;
  bundler: string;
  contracts: {
    entryPoint: string;
    walletFactory: string;
  };
  graphqlEndpoint?: string;
};
