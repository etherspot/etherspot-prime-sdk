import { PrimeSdk } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID),
    projectKey: '', // project key
  });
  const chainId = 1;
  const account = ''; // account address
  const transactions = await primeSdk.getTransactions({ chainId, account });

  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet transactions:`, transactions);
}

main()
  .catch(console.error)
  .finally(() => process.exit());

