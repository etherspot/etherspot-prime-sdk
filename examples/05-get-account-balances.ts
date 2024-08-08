import { DataUtils } from '../data-utils/src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  // initializating Data service...
  const dataService = new DataUtils();

  const balances = await dataService.getAccountBalances({
    account: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    chainId: 137,
  });
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet balances:`, balances);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
