import { NetworkNames } from '../src/sdk/network/constants';
import { PrimeSdk } from '../src';

import { getNetworkConfig } from './config';
import { EnvNames } from '../src/sdk/env';

// add/change to correct network
const config = getNetworkConfig(NetworkNames.Mumbai);

async function main() {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: '' }, { networkName: NetworkNames.Mumbai, env: EnvNames.TestNets, bundlerRpcUrl: config.bundler })

  // get EtherspotWallet address...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
