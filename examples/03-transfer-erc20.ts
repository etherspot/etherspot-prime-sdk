import { ethers } from 'ethers';
import { NetworkNames } from '../src/sdk/network/constants';
import { PrimeSdk } from '../src';

import { getNetworkConfig } from './config';
import { EnvNames } from '../src/sdk/env';
import { printOp } from '../src/sdk/common/OperationUtils';

// add/change these values
const config = getNetworkConfig(NetworkNames.Mumbai);
const recipient: string = '0x80a1874E1046B1cc5deFdf4D3153838B72fF94Ac'; // recipient wallet address
const value: string = '1'; // transfer value
const tokenAddress: string = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';

async function main() {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: '0x513a984bbd054d9fb6d8ba656183185f55bad24a8f900a57a820077374fa9779' }, { networkName: NetworkNames.Mumbai, env: EnvNames.TestNets, bundlerRpcUrl: config.bundler })

  console.log('address: ', primeSdk.state.walletAddress)

  // get address of EtherspotWallet...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  // transfer some native tokens to EtherspotWallet for gas payment (if required)...
  const prefundedNative: string = await primeSdk.depositFromKeyWallet('0.01');
  console.log('\x1b[33m%s\x1b[0m', prefundedNative);

  // transfer some tokens to the EtherspotWallet (if required)...
  const prefunded: string = await primeSdk.depositFromKeyWallet((+value).toString(), tokenAddress);
  console.log('\x1b[33m%s\x1b[0m', prefunded);

  // get erc20 Contract Interface
  const erc20Instance = await primeSdk.getERC20Instance(tokenAddress);

  // get decimals from erc20 contract
  const decimals = await erc20Instance.functions.decimals();

  // get approval encoded data
  const approvalData = await erc20Instance.interface.encodeFunctionData('approve', [address, ethers.utils.parseUnits(value, decimals)]);

  // get transferFrom encoded data
  const transactionData = await erc20Instance.interface.encodeFunctionData('transfer', [recipient, ethers.utils.parseUnits(value, decimals)])

  // clear the transaction batch
  await primeSdk.clearTransactionsFromBatch();

  // add transactions to the batch
  let transactionBatch = await primeSdk.addTransactionToBatch({to: tokenAddress, data: approvalData});
  console.log('transactions: ', transactionBatch);

  // add transactions to the batch
  transactionBatch = await primeSdk.addTransactionToBatch({to: tokenAddress, data: transactionData});
  console.log('transactions: ', transactionBatch);

  // get balance of the account address
  const balance = await primeSdk.getNativeBalance();

  console.log('balances: ', balance);

  // sign transactions added to the batch
  const op = await primeSdk.sign();
  console.log(`Signed UserOp: ${await printOp(op)}`);

  // sending to the bundler...
  const uoHash = await primeSdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  const txHash = await primeSdk.getUserOpReceipt(uoHash);
  console.log('\x1b[33m%s\x1b[0m', `Transaction hash: ${txHash}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
