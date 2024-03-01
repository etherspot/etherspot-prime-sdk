import { DataUtils } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();
const dataApiKey = 'eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjI4ZWJiMGQ5YTMxYjQ3MmY4NmU4MWY2YTVhYzBhMzE1IiwiaCI6Im11cm11cjEyOCJ9';

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils(dataApiKey);
  const hash = '0x7f8633f21d0c0c71d248333a0a2b976495015109a270a6f8a51befe3baf6fb6e';
  const transaction = await dataService.getTransaction({ hash, chainId: 80001 });

  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet transaction:`, transaction);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
