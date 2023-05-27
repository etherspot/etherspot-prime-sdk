import { Observable } from 'rxjs';
import { NetworkConfig } from '.';
import { ObjectSubject, Service, Exception, prepareAddress } from '../common';
import { NETWORK_NAME_TO_CHAIN_ID, NetworkNames, Networks } from './constants';
import { Network, NetworkOptions } from './interfaces';

export class NetworkService extends Service {
  readonly network$ = new ObjectSubject<Network>(null);
  readonly chainId$: Observable<number>;
  readonly defaultNetwork: Network;
  readonly supportedNetworks: Network[];
  readonly externalContractAddresses = new Map<string, { [key: number]: string }>();

  constructor(private options: NetworkOptions, defaultNetworkName?: NetworkNames) {
    super();
    
    const { supportedNetworkNames } = options;

    this.supportedNetworks = supportedNetworkNames
      .map((name) => {
        const chainId = NETWORK_NAME_TO_CHAIN_ID[name];
        return !chainId
          ? null
          : {
              chainId,
              name,
            };
      })
      .filter((value) => !!value);

    if (!this.supportedNetworks.length) {
      throw new Exception('Invalid network config');
    }

    this.defaultNetwork = defaultNetworkName
      ? this.supportedNetworks.find(({ name }) => name === defaultNetworkName)
      : this.supportedNetworks[0];

    if (!this.defaultNetwork) {
      throw new Exception('Unsupported network');
    }

    this.chainId$ = this.network$.observeKey('chainId');
  }

  get network(): Network {
    return this.network$.value;
  }

  get chainId(): number {
    return this.network ? this.network.chainId : null;
  }

  useDefaultNetwork(): void {
    this.network$.next(this.defaultNetwork);
  }

  switchNetwork(networkName: NetworkNames): void {
    this.network$.next(this.supportedNetworks.find(({ name }) => name === networkName) || null);
  }

  isNetworkNameSupported(networkName: string): boolean {
    return !!this.supportedNetworks.find(({ name }) => name === networkName);
  }

  getNetworkConfig(networkName: NetworkNames): NetworkConfig {
    const key = networkName;
    const networkConfig = Networks[key];
    if (!networkConfig) {
      throw new Error(`No network config found for network name '${key}'`);
    }
    return networkConfig;
  }
}
