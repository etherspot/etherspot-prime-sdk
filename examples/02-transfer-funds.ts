import { BigNumberish } from 'ethers';
import { LiteSdk } from '../src';
import { NetworkNames, getNetworkConfig } from './config';

// add/change these values
const config = getNetworkConfig(NetworkNames.Mumbai);
const recipient: string = ''; // recipient wallet address
const value: string = ''; // transfer value

async function main() {
  // initializating sdk...
  const sdk = new LiteSdk(
    process.env.WALLET_PRIVATE_KEY, // owner wallet private key
    config.rpcProvider, // rpc provider
    config.bundler, // bundler rpc
    config.chainId, // chain id
    config.contracts.entryPoint, // entry point
    config.contracts.walletFactory, // etherspot wallet factory
    undefined,
  );

  // get address of EtherspotWallet...
  const address: string = await sdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  // transfer some native tokens to the EtherspotWallet (if required)...
  const prefunded: string = await sdk.prefundIfRequired((+value + 0.01).toString());
  console.log('\x1b[33m%s\x1b[0m', prefunded);

  // parse transfer value to correct format
  const parseValue: BigNumberish = sdk.formatAmount(value);

  // creating and signing userOp...
  const userOp = await sdk.sign({
    target: recipient, // recipient
    value: parseValue, // amount of native asset to send,
    data: '0x', // calldata is empty since we just want to transfer ether
  });

  // sending to the bundler...
  const uoHash = await sdk.send(userOp);
  console.log(`UserOpHash: ${uoHash}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  const txHash = await sdk.getUserOpReceipt(uoHash);
  console.log('\x1b[33m%s\x1b[0m', `Transaction hash: ${txHash}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
