import { Wallet, providers } from 'ethers';
import { LiteSdk } from '../src';

async function main() {
  // initializating sdk...
  const provider = new providers.JsonRpcProvider(process.env.PROVIDER);
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  // const wallet = Wallet.createRandom();
  const sdk = new LiteSdk(
    wallet, // wallet
    'mumbai-aa.etherspot.dev', // bundler rpc
    80001, // chain id
    '0x1D9a2CB3638C2FC8bF9C01D088B79E75CD188b17', // entry point
    '<deployed_personal_account_registry_address>', // personal account registry
    '<deployed_account_factory_address>', // etherspot wallet factory
  );
  const address = await sdk.getCounterFactualAddress();
  console.log(`AA-Wallet address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
