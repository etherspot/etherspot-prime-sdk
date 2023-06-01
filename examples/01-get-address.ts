import { NetworkNames } from '../src/sdk/network/constants';
import { PrimeSdk } from '../src';
import { EnvNames } from '../src/sdk/env';
import * as dotenv from 'dotenv';

dotenv.config();


async function main() {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: '' }, { networkName: NetworkNames.Mumbai, env: EnvNames.TestNets })

  // get EtherspotWallet address...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
