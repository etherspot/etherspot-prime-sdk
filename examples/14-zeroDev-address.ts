import { EtherspotBundler, Factory, PrimeSdk } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();


async function main() {
  const bundlerApiKey = 'etherspot_public_key';
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID), factoryWallet: Factory.ZERO_DEV,
    bundlerProvider: new EtherspotBundler(Number(process.env.CHAIN_ID), bundlerApiKey)
  })

  // get ZeroDev address...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `ZeroDev address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
