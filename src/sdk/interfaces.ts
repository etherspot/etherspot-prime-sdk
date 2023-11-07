import { StateStorage } from './state';
import { SessionStorage } from './session';

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
  sessionStorage?: SessionStorage;
  omitWalletProviderNetworkCheck?: boolean;
  bundlerRpcUrl?: string;
  rpcProviderUrl?: string;
  graphqlEndpoint?: string;
  projectKey: string;
  factoryWallet?: Factory;
  walletFactoryAddress?: string;
  entryPointAddress?: string;
}
