import { StateStorage } from './state';
import { SessionStorage } from './session';
import { VerifyingPaymasterAPI } from './base';

export interface SdkOptions {
  chainId: number;
  stateStorage?: StateStorage;
  sessionStorage?: SessionStorage;
  omitWalletProviderNetworkCheck?: boolean;
  bundlerRpcUrl?: string;
  rpcProviderUrl?: string;
  paymasterApi?: VerifyingPaymasterAPI;
  graphqlEndpoint?: string;
}
