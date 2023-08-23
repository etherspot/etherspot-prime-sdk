import { StateStorage } from './state';
import { SessionStorage } from './session';
import { VerifyingPaymasterAPI } from './base';

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
  projectKey? : string;
  paymasterApi?: PaymasterApi;
}
