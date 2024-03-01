import { DataUtils } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils();
  const exchangeSupportedAssets = await dataService.getExchangeSupportedAssets({ page: 1, limit: 100, account: '', chainId: Number(process.env.CHAIN_ID) });
  console.log('\x1b[33m%s\x1b[0m', `Found exchange supported assets:`, exchangeSupportedAssets.items.length);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
