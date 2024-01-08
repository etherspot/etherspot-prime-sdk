import { StateStorage } from './state';

export interface PaymasterApi {
  url: string;
  context?: any;
}

export enum Factory {
  ZERO_DEV = 'zeroDev',
  ETHERSPOT = 'etherspot',
  SIMPLE_ACCOUNT = 'simpleAccount'
}

export interface SdkOptions {
  chainId: number;
  stateStorage?: StateStorage;
  bundlerRpcUrl?: string;
  rpcProviderUrl?: string;
  graphqlEndpoint?: string;
  projectKey: string;
  factoryWallet?: Factory;
  walletFactoryAddress?: string;
  entryPointAddress?: string;
}

export enum graphqlEndpoints {
  QA = 'qa-etherspot.pillarproject.io',
  PROD = 'etherspot.pillarproject.io'
}
