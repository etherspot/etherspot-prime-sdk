import { ethers } from 'ethers';
import { NetworkNames } from '../src/sdk/network/constants';
import { Sdk } from '../src';

import { getNetworkConfig } from './config';
import { EnvNames } from '../src/sdk/env';

// add/change these values
const config = getNetworkConfig(NetworkNames.Mumbai);
const recipient: string = '0x80a1874E1046B1cc5deFdf4D3153838B72fF94Ac'; // recipient wallet address
const value: string = '1.5'; // transfer value

async function main() {
  // initializating sdk...
  const sdk1 = new Sdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { networkName: NetworkNames.Mumbai, env: EnvNames.TestNets, bundlerRpcUrl: config.bundler })

  console.log('address: ', sdk1.state.walletAddress)

  // get address of EtherspotWallet...
  const address: string = await sdk1.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  // transfer some native tokens to the EtherspotWallet (if required)...
  const prefunded: string = await sdk1.prefundIfRequired((+value + 0.01).toString(), '0x0998B0b3CdED25564a8d2e531D93E666FB21E99d');
  console.log('\x1b[33m%s\x1b[0m', prefunded);

  // creating and signing userOp...
  const userOp = await sdk1.sign({
    target: recipient, // recipient
    value: ethers.utils.parseEther(value), // amount of native asset to send,
    data: '0x', // calldata is empty since we just want to transfer ether
  });

  // sending to the bundler...
  const uoHash = await sdk1.send(userOp);
  console.log(`UserOpHash: ${uoHash}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  const txHash = await sdk1.getUserOpReceipt(uoHash);
  console.log('\x1b[33m%s\x1b[0m', `Transaction hash: ${txHash}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
