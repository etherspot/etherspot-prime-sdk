import { ethers } from 'ethers';
import { EtherspotBundler, PrimeSdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import * as dotenv from 'dotenv';
import { sleep } from '../src/sdk/common';

dotenv.config();

const recipient = '0x80a1874E1046B1cc5deFdf4D3153838B72fF94Ac'; // recipient wallet address
const value = '0.01'; // transfer value
const api_key = 'arka_public_key'; // Only testnets are available, if you need further assistance in setting up a paymaster service for your dapp, please reach out to us on discord or https://etherspot.fyi/arka/intro
const bundlerApiKey = 'eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjMxMDZiOGY2NTRhZTRhZTM4MGVjYjJiN2Q2NDMzMjM4IiwiaCI6Im11cm11cjEyOCJ9';

async function main() {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID), projectKey: 'public-prime-testnet-key',
    bundlerProvider: new EtherspotBundler(Number(process.env.CHAIN_ID), bundlerApiKey)
  })

  console.log('address: ', primeSdk.state.EOAAddress)

  // get address of EtherspotWallet...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  // clear the transaction batch
  await primeSdk.clearUserOpsFromBatch();

  // add transactions to the batch
  const transactionBatch = await primeSdk.addUserOpsToBatch({ to: recipient, value: ethers.utils.parseEther(value) });
  console.log('transactions: ', transactionBatch);

  // get balance of the account address
  const balance = await primeSdk.getNativeBalance();

  console.log('balances: ', balance);

  // estimate transactions added to the batch and get the fee data for the UserOp
  const op = await primeSdk.estimate({
    paymasterDetails: { url: `https://arka.etherspot.io?apiKey=${api_key}&chainId=${Number(process.env.CHAIN_ID)}`, context: { mode: 'sponsor' } }
  });
  console.log(`Estimate UserOp: ${await printOp(op)}`);

  // sign the UserOp and sending to the bundler...
  const uoHash = await primeSdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  let userOpsReceipt = null;
  const timeout = Date.now() + 60000; // 1 minute timeout
  while ((userOpsReceipt == null) && (Date.now() < timeout)) {
    await sleep(2);
    userOpsReceipt = await primeSdk.getUserOpReceipt(uoHash);
  }
  console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
