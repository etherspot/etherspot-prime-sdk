import { PrimeSdk } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
    // initializating sdk...
    const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
        chainId: Number(process.env.CHAIN_ID),
        projectKey: 'public-prime-testnet-key',     // project key
    });

    const tokenLists = await primeSdk.getTokenLists();

    console.log('\x1b[33m%s\x1b[0m', `TokenLists:`, tokenLists);

    const { name } = tokenLists[0];

    let tokenListTokens = await primeSdk.getTokenListTokens();

    console.log('\x1b[33m%s\x1b[0m', `Default token list tokens length:`, tokenListTokens.length);

    tokenListTokens = await primeSdk.getTokenListTokens({
        name,
    });

    console.log('\x1b[33m%s\x1b[0m', `${name} token list tokens length:`, tokenListTokens.length);
}

main()
    .catch(console.error)
    .finally(() => process.exit());
