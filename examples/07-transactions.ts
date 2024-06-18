import { DataUtils } from '../data-utils/src';
import * as dotenv from 'dotenv';
dotenv.config();

const dataApiKey = 'eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjI4ZWJiMGQ5YTMxYjQ3MmY4NmU4MWY2YTVhYzBhMzE1IiwiaCI6Im11cm11cjEyOCJ9';

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils(dataApiKey);
  const account = '0xe05fb316eb8c4ba7288d43c1bd87be8a8d16761c';
  const transactions = await dataService.getTransactions({
    account,
    chainId: 122,
  });

  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet transactions:`, transactions);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
