import { ethers, utils } from 'ethers';
import { PrimeSdk } from '../src';
import * as dotenv from 'dotenv';
dotenv.config();

async function main(): Promise<void> {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID),
    projectKey: '', // project key
  });

  const fromChainId = 56;
  const toChainId = 137;

  const fromAmount = utils.parseUnits('1', 18);

  const quoteRequestPayload = {
    fromChainId: fromChainId,
    toChainId: toChainId,
    fromTokenAddress: ethers.constants.AddressZero,
    toTokenAddress: ethers.constants.AddressZero,
    fromAmount: fromAmount,
  };

  const quotes = await primeSdk.getAdvanceRoutesLiFi(quoteRequestPayload);

  console.log('\x1b[33m%s\x1b[0m', `Quotes:`, quotes.items);

  if (quotes.items.length > 0) {
    const quote = quotes.items[0]; // Selected the first route
    const transactions = await primeSdk.getStepTransaction({ route: quote });

    console.log('\x1b[33m%s\x1b[0m', `transactions:`, transactions);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
