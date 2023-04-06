import { Wallet, providers } from 'ethers';
import { LiteSdk } from '../src';

const ENTRYPOINT_ADDRESS: string = '0x0576a174D229E3cFA37253523E645A78A0C91B57';
const WALLET_FACTORY_ADDRESS: string = '0x3cf07383654c2569867F02098774eddEEea86573';
const PROVIDER_URL: string = '';
const PRIVATE_KEY: string = '';

async function main() {
  // initializating sdk...
  const provider = new providers.JsonRpcProvider(PROVIDER_URL);
  const wallet = new Wallet(PRIVATE_KEY, provider);
  // const wallet = Wallet.createRandom();
  const sdk = new LiteSdk(
    wallet, // wallet
    'https://mumbai-bundler.etherspot.io', // bundler rpc
    80001, // chain id
    ENTRYPOINT_ADDRESS, // entry point
    WALLET_FACTORY_ADDRESS, // etherspot wallet factory
  );
  const address = await sdk.getCounterFactualAddress();
  console.log(`EtherspotWallet address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
