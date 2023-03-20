import { Wallet, ethers, providers } from 'ethers';
import { getVerifyingPaymaster } from 'src/base/VerifyingPaymasterAPI';
import { getGasFee } from '../src/common/getGasFee';
import { printOp } from '../src/common/OperationUtils';
import { getHttpRpcClient } from '../src/common/getHttpRpcClient';
import { LiteSdk } from '../src';

// mumbai contract addresses
const ENTRYPOINT_ADDRESS = '0x1D9a2CB3638C2FC8bF9C01D088B79E75CD188b17';
const REGISTRY_ADDRESS = '<deployed_personal_account_registry_address>';
const ACCOUNT_FACTORY_ADDRESS = '<deployed_account_factory_address>';

export default async function main() {
  const t = ['<recepient_address>', '<recepient_address>', '<recepient_address>']; // recipient address array
  const amount = '1'; // transfer amount
  const paymaster = false; // use paymaster?
  const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
  // logic for paymaster implementation
  // const paymasterAPI = paymaster ? getVerifyingPaymaster(process.env.PAYMASTER_URL, ENTRYPOINT_ADDRESS) : undefined;
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  const sdk = new LiteSdk(
    wallet, // wallet
    'mumbai-aa.etherspot.dev', // bundler rpc
    80001, // chain id
    ENTRYPOINT_ADDRESS, // entry point
    REGISTRY_ADDRESS, // personal account registry
    ACCOUNT_FACTORY_ADDRESS, // etherspot wallet factory
  );
  const sender = await sdk.getCounterFactualAddress();

  const ac = await sdk.getAccountContract();
  const value = ethers.utils.parseEther(amount);
  let dest: Array<string> = [];
  let data: Array<string> = [];
  t.map((addr) => addr.trim()).forEach((addr) => {
    dest = [...dest, sender];
    data = [...data, ac.interface.encodeFunctionData('execute', [ethers.utils.getAddress(addr), value, '0x'])];
  });

  const op = await sdk.sign({
    target: sender,
    data: ac.interface.encodeFunctionData('executeBatch', [dest, data]),
    ...(await getGasFee(provider)),
  });
  console.log(`Signed UserOp: ${await printOp(op)}`);

  const client = await getHttpRpcClient(provider, process.env.BUNDLER_URL, ENTRYPOINT_ADDRESS);
  const uoHash = await client.sendUserOpToBundler(op);
  console.log(`UserOpHash: ${uoHash}`);

  console.log('Waiting for transaction...');
  const txHash = await sdk.getUserOpReceipt(uoHash);
  console.log(`Transaction hash: ${txHash}`);
}
