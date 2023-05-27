import { StateStorage } from './state';
import { SessionStorage } from './session';
import { NetworkNames } from './network';
import { EnvLike } from './env';

export interface SdkOptions {
  env: EnvLike;
  networkName: NetworkNames;
  stateStorage?: StateStorage;
  sessionStorage?: SessionStorage;
  omitWalletProviderNetworkCheck?: boolean;
  bundlerRpcUrl: string;
  rpcProviderUrl?: string;
}
