import { DataUtils, graphqlEndpoints } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils('public-prime-testnet-key', graphqlEndpoints.QA)
  const hash = '0x7f8633f21d0c0c71d248333a0a2b976495015109a270a6f8a51befe3baf6fb6e';
  const transaction = await dataService.getTransaction({ hash, chainId: 80001 });

  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet transaction:`, transaction);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
