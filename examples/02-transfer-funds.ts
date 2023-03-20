import { Wallet, ethers, providers } from 'ethers';
import { LiteSdk } from '../src';

// mumbai contract addresses
const ENTRYPOINT_ADDRESS = '0x1D9a2CB3638C2FC8bF9C01D088B79E75CD188b17';
const REGISTRY_ADDRESS = '0x'; // random for now, can update via contract
const ACCOUNT_FACTORY_ADDRESS = '<deployed_account_factory_address>';

async function main() {
  // initializating sdk...
  const provider = new providers.JsonRpcProvider(process.env.PROVIDER);
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  const sdk = new LiteSdk(
    wallet, // wallet
    process.env.BUNDLER_URL, // bundler rpc
    80001, // chain id
    ENTRYPOINT_ADDRESS, // entry point
    REGISTRY_ADDRESS, // personal account registry
    ACCOUNT_FACTORY_ADDRESS, // etherspot wallet factory
  );

  // creating and signing userOp...
  const userOp = await sdk.sign({
    target: '<recipient_address>', // recipient
    value: ethers.utils.parseEther('0.0001'), // amount of native asset to send,
    data: '0x', // calldata is empty since we just want to transfer ether
  });
  console.log(`Signed userOp: ${userOp}`);

  // sending to the bundler...
  const txHash = await sdk.send(userOp);
  console.log(`Transaction hash: ${txHash}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
