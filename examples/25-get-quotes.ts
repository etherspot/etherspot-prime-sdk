import { utils } from 'ethers';
import { DataUtils } from '../src';
import * as dotenv from 'dotenv';
import { BridgingProvider } from '../src/sdk/data';

dotenv.config();
const dataApiKey = '';

async function main(): Promise<void> {
    // initializating Data service...
    const dataService = new DataUtils(dataApiKey);

    const allSupportedAssets = await dataService.getSupportedAssets({});
    // the default provider is Connext
    console.log('\x1b[33m%s\x1b[0m', `All supported assets:`, allSupportedAssets.length);

    const supportedAssets = await dataService.getSupportedAssets({
        chainId: 1,
        provider: BridgingProvider.Connext,
    });
    console.log('\x1b[33m%s\x1b[0m', `Connext supported assets per chain:`, supportedAssets.length);

    const quotes = await dataService.getQuotes({
        fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        toAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        fromChainId: 1,
        toChainId: 10,
        fromToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        fromAmount: utils.parseUnits('1', 18),
        slippage: 0.1,
        provider: BridgingProvider.Connext,
    });
    console.log('\x1b[33m%s\x1b[0m', `Connext quote transactions:`, quotes);

    const transactionStatus = await dataService.getTransactionStatus({
        fromChainId: 100,
        toChainId: 56,
        transactionHash: '0xfc46adedf462d3fd6cdbe0214ed11c06cba20c385b9875aa4d51c60afbd9725d',
        provider: BridgingProvider.Connext,
    });
    console.log('\x1b[33m%s\x1b[0m', `Connext transaction status:`, transactionStatus);
}

main()
    .catch(console.error)
    .finally(() => process.exit());
