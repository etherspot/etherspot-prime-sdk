import { ethers, utils } from 'ethers';
import { DataUtils } from '../data-utils/src';
import * as dotenv from 'dotenv';
dotenv.config();

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils();

  const fromChainId = 56;
  const toChainId = 137;

  const fromAmount = utils.parseUnits('1', 18);

  const quoteRequestPayload = {
    fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    fromChainId: fromChainId,
    toChainId: toChainId,
    fromTokenAddress: ethers.constants.AddressZero,
    toTokenAddress: ethers.constants.AddressZero,
    fromAmount: fromAmount,
  };

  const quotes = await dataService.getAdvanceRoutesLiFi(quoteRequestPayload);

  console.log('\x1b[33m%s\x1b[0m', `Quotes:`, quotes.items);

  if (quotes.items.length > 0) {
    const quote = quotes.items[0]; // Selected the first route
    const transactions = await dataService.getStepTransaction({ route: quote, account: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' });

    console.log('\x1b[33m%s\x1b[0m', `transactions:`, transactions);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
