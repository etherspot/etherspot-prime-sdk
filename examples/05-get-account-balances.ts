import { DataUtils, graphqlEndpoints } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  // initializating Data service...
  const dataService = new DataUtils('public-prime-testnet-key', graphqlEndpoints.QA)

  const balances = await dataService.getAccountBalances({
    account: '', // address
    chainId: 1,
  });
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet balances:`, balances);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
