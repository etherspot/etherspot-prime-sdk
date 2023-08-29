import { StateStorage } from './state';
import { SessionStorage } from './session';

export interface PaymasterApi {
  url: string;
  context: any;
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
  paymasterApi?: PaymasterApi;
}
