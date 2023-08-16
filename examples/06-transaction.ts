import { PrimeSdk } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID),
    projectKey: '', // project key
  });
  const hash = '0xe6667a1185a6fd93cf082b96f78763514759041940e305da80224609bd1c6781';
  const transaction = await primeSdk.getTransaction({ hash });

  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet transaction:`, transaction);
}

main()
  .catch(console.error)
  .finally(() => process.exit());

