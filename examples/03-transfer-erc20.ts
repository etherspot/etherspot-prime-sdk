import { ethers } from 'ethers';
import { PrimeSdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import { ERC20_ABI } from '../src/sdk/helpers/abi/ERC20_ABI';
import * as dotenv from 'dotenv';

dotenv.config();

// add/change these values
const recipient: string = '0xD129dB5e418e389c3F7D3ae0B8771B3f76799A52'; // recipient wallet address
const value: string = '0.1'; // transfer value
const tokenAddress: string = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';

async function main() {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { chainId: Number(process.env.CHAIN_ID) })

  console.log('address: ', primeSdk.state.walletAddress)

  // get address of EtherspotWallet...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  const provider = new ethers.providers.JsonRpcProvider(process.env.BUNDLER_URL)
  // get erc20 Contract Interface
  const erc20Instance = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

  // get decimals from erc20 contract
  const decimals = await erc20Instance.functions.decimals();

  // get transferFrom encoded data
  const transactionData = erc20Instance.interface.encodeFunctionData('transfer', [recipient, ethers.utils.parseUnits(value, decimals)])

  // clear the transaction batch
  await primeSdk.clearUserOpsFromBatch();

  // add transactions to the batch
  let userOpsBatch = await primeSdk.addUserOpsToBatch({to: tokenAddress, data: transactionData});
  console.log('transactions: ', userOpsBatch);

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
