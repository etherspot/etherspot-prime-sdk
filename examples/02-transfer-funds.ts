import { BigNumber, BigNumberish, ethers } from 'ethers';
import { NetworkNames } from '../src/sdk/network/constants';
import { PrimeSdk } from '../src';
import { EnvNames } from '../src/sdk/env';
import { printOp } from '../src/sdk/common/OperationUtils';

const recipient: string = '0x80a1874E1046B1cc5deFdf4D3153838B72fF94Ac'; // recipient wallet address
const value: string = '0.01'; // transfer value

async function main() {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: '' }, { networkName: NetworkNames.Mumbai, env: EnvNames.TestNets, bundlerRpcUrl: process.env.BUNDLER_URL })

  console.log('address: ', primeSdk.state.walletAddress)

  // get address of EtherspotWallet...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  // transfer some native tokens to the EtherspotWallet (if required)...
  const prefunded: string = await primeSdk.depositFromKeyWallet((+value + 0.01).toString());
  console.log('\x1b[33m%s\x1b[0m', prefunded);

  // clear the transaction batch
  await primeSdk.clearTransactionsFromBatch();

  // add transactions to the batch
  const transactionBatch = await primeSdk.addTransactionToBatch({to: recipient, value: ethers.utils.parseEther(value)});
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
