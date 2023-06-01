import { NetworkNames } from '../src/sdk/network/constants';
import { PrimeSdk } from '../src';
import { getNetworkConfig } from './config';
import { EnvNames } from '../src/sdk/env';
import * as dotenv from 'dotenv';

dotenv.config();

// add/change to correct network
const config = getNetworkConfig(NetworkNames.Mumbai);

async function main() {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: '0x513a984bbd054d9fb6d8ba656183185f55bad24a8f900a57a820077374fa9779' }, { networkName: NetworkNames.Mumbai, env: EnvNames.TestNets, bundlerRpcUrl: process.env.BUNDLER_URL })

  // get EtherspotWallet address...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
