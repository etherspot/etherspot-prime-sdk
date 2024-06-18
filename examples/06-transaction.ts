import { DataUtils } from '../data-utils/src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils();
  const hash = '0x309854c36d5a08fa489085aaba25998473b4b7f5db9eb22982122b3effe7f34c';
  const transaction = await dataService.getTransaction({ hash, chainId: 137 });

  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet transaction:`, transaction);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
