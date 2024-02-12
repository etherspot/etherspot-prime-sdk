import { EtherspotBundler, PrimeSdk } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();


async function main() {
  const bundlerApiKey = 'eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjMxMDZiOGY2NTRhZTRhZTM4MGVjYjJiN2Q2NDMzMjM4IiwiaCI6Im11cm11cjEyOCJ9';
  const customBundlerUrl = '';
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { chainId: Number(process.env.CHAIN_ID), projectKey: 'public-prime-testnet-key', bundlerProvider: new EtherspotBundler(Number(process.env.CHAIN_ID), bundlerApiKey, customBundlerUrl) }) // Testnets dont need apiKey on bundlerProvider

  // get EtherspotWallet address...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
