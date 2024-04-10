import { BigNumber, constants } from 'ethers';
import { DataUtils } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();
const dataApiKey = '';

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils(dataApiKey);
  const exchangeSupportedAssets = await dataService.getExchangeSupportedAssets({ page: 1, limit: 100, account: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', chainId: Number(process.env.CHAIN_ID) });
  console.log('\x1b[33m%s\x1b[0m', `Found exchange supported assets:`, exchangeSupportedAssets.items.length);

  const fromChainId = 1;
  const fromAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
  const fromTokenAddress = constants.AddressZero;
  const toTokenAddress = '0xe3818504c1b32bf1557b16c238b2e01fd3149c17';
  const fromAmount = '1000000000000000000';

  const offers = await dataService.getExchangeOffers({
    fromAddress,
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
