import { LiteSdk } from '../src';
import { getVerifyingPaymaster } from '../src/base/VerifyingPaymasterAPI';
import { printOp } from '../src/common/OperationUtils';
import { NetworkNames, getNetworkConfig } from './config';

// add/change these values
const config = getNetworkConfig(NetworkNames.Mumbai);
const erc20TokenAddress: string = ''; // ERC20 token address
const recipient: string = ''; // receipient wallet address
const value: string = ''; // transfer value

async function main() {
  // logic for paymaster implementation
  const paymasterAPI = config.paymaster.use
    ? getVerifyingPaymaster(config.paymaster.url, config.contracts.entryPoint)
    : undefined;
  // initializating sdk...
  const sdk = new LiteSdk(
    process.env.WALLET_PRIVATE_KEY, // owner wallet private key
    config.rpcProvider, // rpc provider
    config.bundler, // bundler rpc
    config.chainId, // chain id
    config.contracts.entryPoint, // entry point
    config.contracts.walletFactory, // etherspot wallet factory
    paymasterAPI,
  );

  // get address of EtherspotWallet...
  const address: string = await sdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  // transfer some of the ERC20 token to the EtherspotWallet (if required)...
  const prefunded: string = await sdk.prefundIfRequired((+value + 0.01).toString(), erc20TokenAddress);
  console.log('\x1b[33m%s\x1b[0m', prefunded);

  // connect to the ERC20 token contract...
  const erc20 = await sdk.getERC20Instance(erc20TokenAddress);
  const [symbol, decimals] = await Promise.all([erc20.symbol(), erc20.decimals()]);

  // parse transfer value to correct format
  const parseAmount = sdk.formatAmount(value, decimals);
  console.log(`Transferring ${value} ${symbol}...`);

  // creating and signing userOp...
  const op = await sdk.sign({
    target: erc20.address,
    data: erc20.interface.encodeFunctionData('transfer', [recipient, parseAmount]),
  });
  console.log(`Signed UserOperation: ${await printOp(op)}`);

  // sending to the bundler...
  const uoHash = await sdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  const txHash = await sdk.getUserOpReceipt(uoHash);
  console.log('\x1b[33m%s\x1b[0m', `Transaction hash: ${txHash}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
