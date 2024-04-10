import { utils } from 'ethers';
import { DataUtils } from '../src';
import * as dotenv from 'dotenv';

dotenv.config();
const dataApiKey = '';

async function main(): Promise<void> {
    // initializating Data service...
    const dataService = new DataUtils(dataApiKey);

    const allSupportedAssets = await dataService.getConnextSupportedAssets({});
    console.log('\x1b[33m%s\x1b[0m', `Connext all supported assets:`, allSupportedAssets.length);

    const supportedAssets = await dataService.getConnextSupportedAssets({
        chainId: 1,
    });
    console.log('\x1b[33m%s\x1b[0m', `Connext supported assets per chain:`, supportedAssets.length);

    const quotes = await dataService.getConnextQuotes({
        fromAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        toAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        fromChainId: 1,
        toChainId: 10,
        fromToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        fromAmount: utils.parseUnits('1', 18),
        slippage: 0.1
    });
    console.log('\x1b[33m%s\x1b[0m', `Connext quote transactions:`, quotes);

    const transactionStatus = await dataService.getConnextTransactionStatus({
        fromChainId: 100,
        toChainId: 56,
        transactionHash: '0xfc46adedf462d3fd6cdbe0214ed11c06cba20c385b9875aa4d51c60afbd9725d'
    });
    console.log('\x1b[33m%s\x1b[0m', `Connext transaction status:`, transactionStatus);
}

main()
    .catch(console.error)
    .finally(() => process.exit());
