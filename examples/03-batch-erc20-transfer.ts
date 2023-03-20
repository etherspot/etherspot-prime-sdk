import { Wallet, ethers, providers } from 'ethers';
import { getVerifyingPaymaster } from 'src/base/VerifyingPaymasterAPI';
import { getGasFee } from 'src/common';
import { ERC20_ABI } from 'src/helpers/ERC20_ABI';
import { printOp } from 'src/common/OperationUtils';
import { getHttpRpcClient } from 'src/common/getHttpRpcClient';
import { LiteSdk } from '../src';

// mumbai contract addresses
const ENTRYPOINT_ADDRESS = '0x1D9a2CB3638C2FC8bF9C01D088B79E75CD188b17';
const REGISTRY_ADDRESS = '<deployed_personal_account_registry_address>';
const ACCOUNT_FACTORY_ADDRESS = '<deployed_account_factory_address>';

const token = '<token_address>'; // erc20 token address
const t = ['<recepient_address>', '<recepient_address>', '<recepient_address>']; // recipient address array
const amount = '1'; // transfer amount
const paymaster = false; // use paymaster?

async function main() {
  // initializating sdk...
  const provider = new providers.JsonRpcProvider(process.env.PROVIDER);
  // logic for paymaster implementation
  // const paymasterAPI = paymaster ? getVerifyingPaymaster(process.env.PAYMASTER_URL, ENTRYPOINT_ADDRESS) : undefined;
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  const sdk = new LiteSdk(
    wallet, // wallet
    process.env.BUNDLER_URL, // bundler rpc
    80001, // chain id
    ENTRYPOINT_ADDRESS, // entry point
    REGISTRY_ADDRESS, // personal account registry
    ACCOUNT_FACTORY_ADDRESS, // etherspot wallet factory
  );

  const sender = await sdk.getCounterFactualAddress();
  const tkn = ethers.utils.getAddress(token);
  const erc20 = new ethers.Contract(tkn, ERC20_ABI, provider);
  const [sym, dec] = await Promise.all([erc20.symbol(), erc20.decimals()]);
  const amt = ethers.utils.parseUnits(amount, dec);

  let dest: Array<string> = [];
  let data: Array<string> = [];
  t.map((addr) => addr.trim()).forEach((addr) => {
    dest = [...dest, erc20.address];
    data = [...data, erc20.interface.encodeFunctionData('transfer', [ethers.utils.getAddress(addr), amt])];
  });
  console.log(`Batch transferring ${amount} ${sym} to ${dest.length} receipients... `);

  const ac = await sdk.getAccountContract();
  const op = await sdk.sign({
    target: sender,
    data: ac.interface.encodeFunctionData('executeBatch', [dest, data]),
    ...(await getGasFee(provider)),
  });
  console.log(`Signed UserOp: ${await printOp(op)}`);

  const client = await getHttpRpcClient(provider, process.env.BUNDLER_URL, ENTRYPOINT_ADDRESS);
  const userOpHash = await client.sendUserOpToBundler(op);
  console.log(`UserOperation hash: ${userOpHash}`);

  console.log('Waiting for transaction...');
  const txHash = await sdk.getUserOpReceipt(userOpHash);
  console.log(`Transaction hash: ${txHash}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
