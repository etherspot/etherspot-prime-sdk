import { EtherspotBundler, Factory, PrimeSdk } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();


async function main() {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { chainId: Number(process.env.CHAIN_ID), projectKey: 'public-prime-testnet-key', factoryWallet: Factory.SIMPLE_ACCOUNT, 
    bundlerProvider: new EtherspotBundler(Number(process.env.CHAIN_ID)) 
  })

  // get SimpleAccount address...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `SimpleAccount address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
