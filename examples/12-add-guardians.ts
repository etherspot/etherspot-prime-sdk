import { ethers } from 'ethers';
import { PrimeSdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import * as dotenv from 'dotenv';
import { sleep } from '../src/sdk/common';

dotenv.config();

async function main() {
  // initializating sdk...
  const primeSdk = new PrimeSdk(
    { privateKey: process.env.WALLET_PRIVATE_KEY },
    { chainId: Number(process.env.CHAIN_ID), projectKey: 'public-prime-testnet-key' },
  );

  console.log('address: ', primeSdk.state.EOAAddress);

  // get address of EtherspotWallet
  const address: string = await primeSdk.getCounterFactualAddress();

  // update the addresses in this array with the guardian addresses you want to set
  const guardianAddresses: string[] = [
    '0xa8430797A27A652C03C46D5939a8e7698491BEd6',
    '0xaf2D76acc5B0e496f924B08491444076219F2f35',
    '0xBF1c0A9F3239f5e7D35cE562Af06c92FB7fdF0DF',
  ];

  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  const addGuardianInterface = new ethers.utils.Interface(['function addGuardian(address _newGuardian)']);

  const addGuardianData1 = addGuardianInterface.encodeFunctionData('addGuardian', [guardianAddresses[0]]);
  const addGuardianData2 = addGuardianInterface.encodeFunctionData('addGuardian', [guardianAddresses[1]]);
  const addGuardianData3 = addGuardianInterface.encodeFunctionData('addGuardian', [guardianAddresses[2]]);

  // clear the transaction batch
  await primeSdk.clearUserOpsFromBatch();

  // add transactions to the batch
  let userOpsBatch = await primeSdk.addUserOpsToBatch({ to: address, data: addGuardianData1 });
  userOpsBatch = await primeSdk.addUserOpsToBatch({ to: address, data: addGuardianData2 });
  userOpsBatch = await primeSdk.addUserOpsToBatch({ to: address, data: addGuardianData3 });
  console.log('transactions: ', userOpsBatch);

  // sign transactions added to the batch
  const op = await primeSdk.estimate();
  console.log(`Estimated UserOp: ${await printOp(op)}`);

  // sign the userOps and sending to the bundler...
  const uoHash = await primeSdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  let userOpsReceipt = null;
  const timeout = Date.now() + 60000; // 1 minute timeout
  while (userOpsReceipt == null && Date.now() < timeout) {
    await sleep(2);
    userOpsReceipt = await primeSdk.getUserOpReceipt(uoHash);
  }
  console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
