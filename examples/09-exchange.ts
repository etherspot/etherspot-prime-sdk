import { DataUtils } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();
const dataApiKey = 'eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjI4ZWJiMGQ5YTMxYjQ3MmY4NmU4MWY2YTVhYzBhMzE1IiwiaCI6Im11cm11cjEyOCJ9';

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils(dataApiKey);
  const exchangeSupportedAssets = await dataService.getExchangeSupportedAssets({ page: 1, limit: 100, account: '', chainId: Number(process.env.CHAIN_ID) });
  console.log('\x1b[33m%s\x1b[0m', `Found exchange supported assets:`, exchangeSupportedAssets.items.length);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
