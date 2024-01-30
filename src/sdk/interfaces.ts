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
  projectKey: string;
  stateStorage?: StateStorage;
  bundlerRpcUrl?: string;
  rpcProviderUrl?: string;
  graphqlEndpoint?: string;
  etherspotBundlerApiKey?: string;
  factoryWallet?: Factory;
  walletFactoryAddress?: string;
  entryPointAddress?: string;
  accountAddress?: string;
  index?: number;
}

export enum graphqlEndpoints {
  QA = 'qa-etherspot.pillarproject.io',
  PROD = 'etherspot.pillarproject.io'
}
