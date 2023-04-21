import { LiteSdk } from '../src';
import { getVerifyingPaymaster } from '../src/base/VerifyingPaymasterAPI';
import { printOp } from '../src/common/OperationUtils';
import { NetworkNames, getNetworkConfig } from './config';

// add/change these values
const config = getNetworkConfig(NetworkNames.Mumbai);
const erc20TokenAddress: string = ''; // ERC20 token address
const recipients: Array<string> = ['', '', '']; // recipient wallet addresses
const values: Array<string> = ['', '', '']; // transfer values

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
  const totalValue: number = values.reduce((acc: number, curr: string) => {
    return acc + parseFloat(curr);
  }, 0);
  const prefunded: string = await sdk.prefundIfRequired((+totalValue + 0.01).toString(), erc20TokenAddress);
  console.log('\x1b[33m%s\x1b[0m', prefunded);

  const { dest, data } = await sdk.generateERC20BatchTransfersData(erc20TokenAddress, recipients, values);

  // creating and signing userOp...
  const op = await sdk.sign({
    target: address,
    data: await sdk.encodeBatch(dest, data),
  });
  console.log(`Signed UserOp: ${await printOp(op)}`);

  // sending to the bundler...
  const userOpHash = await sdk.send(op);
  console.log(`UserOperation hash: ${userOpHash}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  const txHash = await sdk.getUserOpReceipt(userOpHash);
  console.log('\x1b[33m%s\x1b[0m', `Transaction hash: ${txHash}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
