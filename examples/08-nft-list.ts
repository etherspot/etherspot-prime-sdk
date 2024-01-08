import { DataUtils, graphqlEndpoints } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils('public-prime-testnet-key', graphqlEndpoints.QA)
  const chainId = 137;
  const account = '';  // account address
  const nfts = await dataService.getNftList({ chainId, account });

  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet nfts:`, nfts);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
