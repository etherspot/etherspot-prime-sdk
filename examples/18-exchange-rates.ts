import { RateData } from '../src/sdk/data';
import { DataUtils } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils();

  const ETH_AAVE_ADDR = '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9';
  const ETH_MATIC_ADDR = '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0';
  const ETH_USDC_ADDR = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const TOKEN_LIST = [ETH_AAVE_ADDR, ETH_MATIC_ADDR, ETH_USDC_ADDR];
  const ETH_CHAIN_ID = 1;

  const requestPayload = {
    tokens: TOKEN_LIST,
    chainId: ETH_CHAIN_ID,
  };

  const rates: RateData = await dataService.fetchExchangeRates(requestPayload);

  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet Rates:`, rates);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
