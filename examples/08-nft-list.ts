import { DataUtils } from '../data-utils/src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils();
  const chainId = 137;
  const account = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';  // account address
  const nfts = await dataService.getNftList({ chainId, account });

  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet nfts:`, nfts);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
