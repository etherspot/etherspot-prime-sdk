import { utils } from 'ethers';
import { DataUtils, graphqlEndpoints } from '../src';
import * as dotenv from 'dotenv';
import { BridgingQuotes, CrossChainServiceProvider } from '../src/sdk/data';
dotenv.config();

async function main(): Promise<void> {
  // initializating Data service...
  const dataService = new DataUtils('public-prime-testnet-key', graphqlEndpoints.QA)

  const XdaiUSDC = '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83'; // Xdai - USDC
  const MaticUSDC = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // Matic - USDC

  const fromChainId = 137;
  const toChainId = 100;
  const fromTokenAddress: string = MaticUSDC;
  const toTokenAddress: string = XdaiUSDC;

  // MATIC USDC has 6 decimals
  const fromAmount = utils.parseUnits('1', 6); // 10 USDC

  const quoteRequestPayload = {
    fromChainId: fromChainId,
    toChainId: toChainId,
    fromTokenAddress: fromTokenAddress,
    toTokenAddress: toTokenAddress,
    fromAddress: '', // from address
    fromAmount: fromAmount,
    serviceProvider: CrossChainServiceProvider.LiFi, // Optional parameter
  };

  const quotes: BridgingQuotes = await dataService.getCrossChainQuotes(quoteRequestPayload);

  console.log('\x1b[33m%s\x1b[0m', `Quotes:`, quotes);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
