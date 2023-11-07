import { ethers } from 'ethers';
import { Factory, PrimeSdk } from '../src';
import { printOp } from '../src/sdk/common/OperationUtils';
import * as dotenv from 'dotenv';
import { sleep } from '../src/sdk/common';
import { ERC20_ABI } from '../src/sdk/helpers/abi/ERC20_ABI';

dotenv.config();

const recipient = '0x80a1874E1046B1cc5deFdf4D3153838B72fF94Ac'; // recipient wallet address
const value = '0.0001'; // transfer value

async function main() {
  // initializating sdk...
  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, { 
    chainId: Number(process.env.CHAIN_ID), projectKey: '',
    // bundlerRpcUrl: 'https://api.stackup.sh/v1/node/d77f875709ca7452996fea015c793cdd18988596fbafd977ef69816481fdf6cb',
    factoryWallet: Factory.SIMPLE_ACCOUNT,
    // bundlerRpcUrl: 'https://goerli-bundler.etherspot.io',
    // entryPointAddress: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    // walletFactoryAddress: '0x5de4839a76cf55d0c90e2061ef4386d962E15ae3',
  })

  console.log('address: ', primeSdk.state.walletAddress)

  // get address of EtherspotWallet...
  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  // get balance of the account address
  const balance = await primeSdk.getNativeBalance();
  console.log('balances: ', balance);

  // const tokenAddress = "0xa05f0FCEB70a7a6d90FA3419c1469bEe206882EA";

  // const OpUsdc = '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85';
  // // const OpErc20Paymaster = '0x071Cdd89455eD5e8f09215709bf1fe6DB0ba8249';
  // const OpErc20Paymaster = '0x99fB8d618F52a42049776899D5c07241D344a8A4';
  // // const ERC20PaymasterAddress = "0x53F48579309f8dBfFE4edE921C50200861C2482a";
  // // const PolyUsdc = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  // // const Polypaymaster = "0xa683b47e447De6c8A007d9e294e87B6Db333Eb18";

  // const decimals = 6;
  // const amt = '3';
  // const erc20Contract = new ethers.Contract(tokenAddress, ERC20_ABI)
  // const encodedData = erc20Contract.interface.encodeFunctionData('approve', ["0x6Ea25cbb60360243E871dD935225A293a78704a8", ethers.constants.MaxUint256])
  // // const encodedData = erc20Contract.interface.encodeFunctionData("transfer", ["0x92cF16643B61b70E36Bb765C89334843157eF2a9", ethers.utils.parseUnits(amt, decimals)])
  // await primeSdk.addUserOpsToBatch({to: tokenAddress, data: encodedData});
  // const approveOp = await primeSdk.estimate();
  // console.log(`UserOp: ${await printOp(approveOp)}`);
  // const uoHash1 = await primeSdk.send(approveOp);
  // console.log(`UserOpHash: ${uoHash1}`);

  // // get transaction hash...
  // console.log('Waiting for transaction...');
  // let userOpsReceipt1 = null;
  // const timeout1 = Date.now() + 60000; // 1 minute timeout
  // while((userOpsReceipt1 == null) && (Date.now() < timeout1)) {
  //   await sleep(2);
  //   userOpsReceipt1 = await primeSdk.getUserOpReceipt(uoHash1);
  // }
  // console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt1);

  // // clear the transaction batch
  // await primeSdk.clearUserOpsFromBatch();

  // // // add transactions to the batch
  const transactionBatch = await primeSdk.addUserOpsToBatch({to: recipient, value: ethers.utils.parseEther(value)});
  console.log('transactions: ', transactionBatch);

  // // get balance of the account address
  // balance = await primeSdk.getNativeBalance();

  // // const provider = new ethers.providers.JsonRpcProvider('https://optimism-bundler.etherspot.io');

  // // console.log(await provider.getStorageAt('0x0b2c639c533813f4aa9d7837caf62653d097ff85', '0x10d6a54a4754c8869d6886b5f5d7fbfa5b4522237ea5c60d11bc4e7a1ff9390b'));

  // console.log('balances: ', balance);

  // // estimate transactions added to the batch and get the fee data for the UserOp
  // const op = await primeSdk.estimate({url: `http://0.0.0.0:5050?api_key=devVignesh&chainId=${Number(process.env.CHAIN_ID)}`, context: {token: "USDCT", mode: 'sponsor', validAfter: new Date().valueOf() + 300000, validUntil: new Date().valueOf() + 600000}});
  const op = await primeSdk.estimate({url: `http://0.0.0.0:5050?api_key=devVignesh&chainId=${Number(process.env.CHAIN_ID)}`, context: {token: "USDCT", mode: 'sponsor'}});
  // const op = await primeSdk.estimate();
  console.log(`Estimate UserOp: ${await printOp(op)}`);

  // // sign the UserOp and sending to the bundler...
  // const uoHash = await primeSdk.send(op);
  // console.log(`UserOpHash: ${uoHash}`);

  // // get transaction hash...
  // console.log('Waiting for transaction...');
  // let userOpsReceipt = null;
  // const timeout = Date.now() + 600000; // 1 minute timeout
  // while((userOpsReceipt == null) && (Date.now() < timeout)) {
  //   await sleep(2);
  //   userOpsReceipt = await primeSdk.getUserOpReceipt(uoHash);
  // }
  // console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);


}

main()
  .catch(console.error)
  .finally(() => process.exit());
