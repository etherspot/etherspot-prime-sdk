import { PrimeSdk } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    // initializating sdk...
    const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { chainId: Number(process.env.CHAIN_ID) });

    const balances = await primeSdk.getAccountBalances({
        account: '', // account address
        chainId: 1,
    });
    console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet balances:`, balances);
}

main()
  .catch(console.error)
  .finally(() => process.exit());

