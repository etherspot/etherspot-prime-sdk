import { LiteSdk } from '../src';
import { getVerifyingPaymaster } from '../src/base/VerifyingPaymasterAPI';
import { printOp } from '../src/common/OperationUtils';
import { SWAP_ROUTER_ABI } from '../src/helpers/abi/UNISWAP_V3_SWAP_ROUTER_ABI';
import { NetworkNames, getNetworkConfig } from './config';

// add/change to correct network
const config = getNetworkConfig(NetworkNames.Mumbai);
const swapTokenA = '0x583f8424c6adC530D286B5292191203497fF8980'; // replace with the address of the first token you want to add liquidity for
const swapTokenB = '0x614bC50B9E467dEa445d7e04c3c58051B662401f'; // replace with the address of the second token you want to add liquidity for
// pool address: 0x17aa8919F11ce6b35D6eC5723D24be59082D4cAd
const value: string = '1'; // Add values to transfer here

async function main() {
  // logic for paymaster implementation
  const paymasterAPI = config.paymaster.use
    ? getVerifyingPaymaster(config.paymaster.url, config.contracts.entryPoint)
    : undefined;
  // initializating sdk...
  const sdk = new LiteSdk(
    process.env.WALLET_PRIVATE_KEY, // owner wallet private key
    config.rpcProvider, // rpc provider
    config.bundler, // bundler rpc
    config.chainId, // chain id
    config.contracts.entryPoint, // entry point
    config.contracts.walletFactory, // etherspot wallet factory
    paymasterAPI,
  );

  // get address of EtherspotWallet...
  const address: string = await sdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  const preTransferTokenA = await sdk.erc20Balance(address, swapTokenA);
  const preTransferTokenB = await sdk.erc20Balance(address, swapTokenB);
  console.log('EtherspotWallet balance of SwapTokenA:', sdk.parseAmount(preTransferTokenA.toString()));
  console.log('EtherspotWallet balance of SwapTokenB:', sdk.parseAmount(preTransferTokenB.toString()));

  // connect to the ERC20 token contract...
  const erc20 = await sdk.getERC20Instance(swapTokenA);
  const [decimals] = await Promise.all([erc20.decimals()]);
  const parseValue = sdk.formatAmount(value, decimals);

  // prefund tokens for swap (if required)...
  await sdk.mintTokenToOwner(swapTokenA, (+value + 0.01).toString());
  const prefunded = await sdk.prefundIfRequired((+value + 0.01).toString());
  console.log('\x1b[33m%s\x1b[0m', prefunded);
  const prefundedERC20 = await sdk.prefundIfRequired((+value + 0.01).toString(), swapTokenA);
  console.log('\x1b[33m%s\x1b[0m', prefundedERC20);

  // connecting to swap router...
  const swapRouter = await sdk.connectToContract(config.contracts.uniswapV3SwapRouter, SWAP_ROUTER_ABI);

  // creating and signing userOp to approve router to spend tokens...
  const op = await sdk.sign({
    target: erc20.address,
    data: erc20.interface.encodeFunctionData('approve', [config.contracts.uniswapV3SwapRouter, parseValue]),
  });
  console.log(`Signed UserOperation: ${await printOp(op)}`);

  // sending to the bundler...
  const uoHash = await sdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  const txHash = await sdk.getUserOpReceipt(uoHash);
  console.log('\x1b[33m%s\x1b[0m', `Transaction hash: ${txHash}`);

  ///////////////////////////////////////////////
  ///////////////////////////////////////////////

  // generate data for swap...
  const params = await sdk.generateUniSingleSwapParams(swapTokenA, swapTokenB, value);
  const swapData = swapRouter.interface.encodeFunctionData('exactInputSingle', [params]);

  // creating and signing userOp to swap tokens...
  const op1 = await sdk.sign({
    target: config.contracts.uniswapV3SwapRouter,
    data: swapData,
  });
  console.log(`Signed UserOperation: ${await printOp(op1)}`);

  // sending to the bundler...
  const uoHash1 = await sdk.send(op1);
  console.log(`UserOpHash: ${uoHash1}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  const txHash1 = await sdk.getUserOpReceipt(uoHash1);
  console.log('\x1b[33m%s\x1b[0m', `Transaction hash: ${txHash1}`);

  const postTransferERC20Balance = await sdk.erc20Balance(address, swapTokenB);
  console.log('EtherspotWallet balance of SwapTokenB:', sdk.parseAmount(postTransferERC20Balance.toString()));
}

main()
  .catch(console.error)
  .finally(() => process.exit());
