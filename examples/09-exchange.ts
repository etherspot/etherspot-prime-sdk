import { DataUtils, graphqlEndpoints } from '../src';
import * as dotenv from 'dotenv';
import { BigNumber, constants } from 'ethers';

dotenv.config();

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils('public-prime-testnet-key', graphqlEndpoints.QA)
  const exchangeSupportedAssets = await dataService.getExchangeSupportedAssets({ page: 1, limit: 100, account: '', chainId: Number(process.env.CHAIN_ID) });
  console.log('\x1b[33m%s\x1b[0m', `Found exchange supported assets:`, exchangeSupportedAssets.items.length);

  const fromTokenAddress = '0xe3818504c1b32bf1557b16c238b2e01fd3149c17';
  const toTokenAddress = constants.AddressZero;
  const fromAmount = '1000000000000000000';
  const fromChainId = 1;

  const offers = await dataService.getExchangeOffers({
    fromAddress: '',
    fromChainId,
    fromTokenAddress,
    toTokenAddress,
    fromAmount: BigNumber.from(fromAmount),
  });

  console.log('\x1b[33m%s\x1b[0m', `Exchange offers:`, offers);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
