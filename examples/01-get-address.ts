import { Wallet, providers } from 'ethers';
import { LiteSdk } from '../src';

async function main() {
  // initializating sdk...
  const provider = new providers.JsonRpcProvider(process.env.PROVIDER);
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  // const wallet = Wallet.createRandom();
  const sdk = new LiteSdk(
    wallet, // wallet
    'https://mumbai-bundler.etherspot.io', // bundler rpc
    80001, // chain id
    '0x0576a174D229E3cFA37253523E645A78A0C91B57', // entry point
    '<deployed_personal_account_registry_address>', // personal account registry
    '<deployed_account_factory_address>', // etherspot wallet factory
  );
  const address = await sdk.getCounterFactualAddress();
  console.log(`AA-Wallet address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
