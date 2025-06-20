import { EtherspotBundler, PrimeSdk } from '../src';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();


async function main() {
  const bundlerApiKey = 'etherspot_public_key';
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { chainId: Number(137), bundlerProvider: new EtherspotBundler(137, bundlerApiKey) }) // Testnets dont need apiKey on bundlerProvider

  // get EtherspotWallet address...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
