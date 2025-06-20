import { EtherspotBundler, PrimeSdk } from '../src';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();


async function main() {
  const bundlerApiKey = '***REMOVED***';
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: "***REMOVED***" }, { chainId: Number(137), bundlerProvider: new EtherspotBundler(137, bundlerApiKey) }) // Testnets dont need apiKey on bundlerProvider

  // get EtherspotWallet address...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  const provider = new ethers.providers.JsonRpcProvider(`https://rpc.etherspot.io/v1/100?api-key=${bundlerApiKey}`);
  const balance = await provider.getBalance(address);
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet balance: ${ethers.utils.formatEther(balance)} MATIC`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
