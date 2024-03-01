import { DataUtils } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();
const dataApiKey = 'eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjI4ZWJiMGQ5YTMxYjQ3MmY4NmU4MWY2YTVhYzBhMzE1IiwiaCI6Im11cm11cjEyOCJ9';

async function main() {
  // initializating Data service...
  const dataService = new DataUtils(dataApiKey);

  const balances = await dataService.getAccountBalances({
    account: '', // address
    chainId: 1,
  });
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet balances:`, balances);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
