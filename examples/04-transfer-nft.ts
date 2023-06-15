import { ethers } from 'ethers';
import { PrimeSdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import * as dotenv from 'dotenv';

dotenv.config();

// add/change these values
const recipient: string = '0xD129dB5e418e389c3F7D3ae0B8771B3f76799A52'; // recipient wallet address
const tokenAddress: string = '0xe55C5793a52AF819fBf3e87a23B36708E6FDd2Cc';
const tokenId = 4;

async function main() {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { chainId: Number(process.env.CHAIN_ID) })

  console.log('address: ', primeSdk.state.walletAddress)

  // get address of EtherspotWallet...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  const erc721Interface = new ethers.utils.Interface([
    'function safeTransferFrom(address _from, address _to, uint256 _tokenId)'
  ])

  const erc721Data = erc721Interface.encodeFunctionData('safeTransferFrom', [address, recipient, tokenId]);

  // clear the transaction batch
  await primeSdk.clearUserOpsFromBatch();

  // add transactions to the batch
  let userOpsBatch = await primeSdk.addUserOpsToBatch({to: tokenAddress, data: erc721Data});
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
