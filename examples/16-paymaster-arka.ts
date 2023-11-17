import { ethers, utils } from 'ethers';
import { PrimeSdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import * as dotenv from 'dotenv';
import { sleep } from '../src/sdk/common';
import { ERC20_ABI } from '../src/sdk/helpers/abi/ERC20_ABI';

dotenv.config();

const recipient = '0x80a1874E1046B1cc5deFdf4D3153838B72fF94Ac'; // recipient wallet address
const value = '0.0001'; // transfer value

const arka_api_key = 'arka_public_key';
const arka_url = 'https://arka.etherspot.io'; // Only testnets are available, if you need further assistance in setting up a paymaster service for your dapp, please reach out to us on discord or https://etherspot.fyi/arka/intro
const queryString = `?apiKey=${arka_api_key}&chainId=${Number(process.env.CHAIN_ID)}`;

async function main() {
  // initializing sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID), projectKey: 'public-prime-testnet-key',
  })

  console.log('address: ', primeSdk.state.walletAddress)

  const entryPointAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

  // get address of EtherspotWallet...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  // get balance of the account address
  let balance = await primeSdk.getNativeBalance();
  console.log('balances: ', balance);

  const tokenAddress = "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23"; // USDC Token address on Mumbai

  /**
   * The fetching of pimlico erc20 paymaster address is only required for the first time for each specified gas token since we need to approve the tokens to spend
   * from the paymaster address on behalf of you.
   */
  const returnedValue = await fetch(`${arka_url}/pimlicoAddress${queryString}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "params": [entryPointAddress, { token: "USDC" }] })
  })
    .then((res) => {
      return res.json()
    }).catch((err) => {
      console.log(err);
    });
  const paymasterAddress = returnedValue.message;

  if (utils.isAddress(paymasterAddress)) {
    console.log('Value returned: ', paymasterAddress); // getting paymaster address for the selected gas token

    const erc20Contract = new ethers.Contract(tokenAddress, ERC20_ABI)
    const encodedData = erc20Contract.interface.encodeFunctionData('approve', [paymasterAddress, ethers.constants.MaxUint256]) // Infinite Approval
    await primeSdk.addUserOpsToBatch({ to: tokenAddress, data: encodedData });
    const approveOp = await primeSdk.estimate();
    console.log(`UserOpHash: ${await printOp(approveOp)}`);
    const uoHash1 = await primeSdk.send(approveOp);
    console.log(`UserOpHash: ${uoHash1}`);

    // get transaction hash...
    console.log('Waiting for transaction...');
    let userOpsReceipt1 = null;
    const timeout1 = Date.now() + 60000; // 1 minute timeout
    while ((userOpsReceipt1 == null) && (Date.now() < timeout1)) {
      await sleep(2);
      userOpsReceipt1 = await primeSdk.getUserOpReceipt(uoHash1);
    }
    console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt1);

    // clear the transaction batch
    await primeSdk.clearUserOpsFromBatch();

    // add transactions to the batch
    const transactionBatch = await primeSdk.addUserOpsToBatch({ to: recipient, value: ethers.utils.parseEther(value) });
    console.log('transactions: ', transactionBatch);

    // get balance of the account address
    balance = await primeSdk.getNativeBalance();

    console.log('balances: ', balance);

    // estimate transactions added to the batch and get the fee data for the UserOp
    const op = await primeSdk.estimate({ url: `${arka_url}${queryString}`, context: { token: "USDC", mode: 'erc20' } });
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
  } else {
    console.log('Unable to fetch the paymaster address. Error returned: ', returnedValue)
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
