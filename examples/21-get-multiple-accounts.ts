import { EtherspotBundler, PrimeSdk } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  // initializating sdk for index 0...
  const primeSdk = new PrimeSdk(
    { privateKey: process.env.WALLET_PRIVATE_KEY },
    { chainId: Number(process.env.CHAIN_ID), projectKey: 'public-prime-testnet-key', bundlerProvider: new EtherspotBundler(Number(process.env.CHAIN_ID)) },
  );

  // get EtherspotWallet address for index 0...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address for index 0: ${address}`);

  // initializating sdk for index 1...
  const primeSdk1 = new PrimeSdk(
    { privateKey: process.env.WALLET_PRIVATE_KEY },
    { chainId: Number(process.env.CHAIN_ID), projectKey: 'public-prime-testnet-key', index: 1, bundlerProvider: new EtherspotBundler(Number(process.env.CHAIN_ID)) },
  );

  // get EtherspotWallet address for index 1...
  const address1: string = await primeSdk1.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address for index 1: ${address1}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
