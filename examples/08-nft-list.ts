import { PrimeSdk } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID),
    projectKey: 'public-prime-testnet-key', // project key
  });
  const chainId = 137;
  const account = '';  // account address
  const nfts = await primeSdk.getNftList({ chainId, account });

  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet nfts:`, nfts);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
