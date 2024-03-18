import { DataUtils } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils();
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
