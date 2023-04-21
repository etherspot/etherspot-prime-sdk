import { LiteSdk } from '../src';
import { NetworkNames, getNetworkConfig } from './config';

// add/change to correct network
const config = getNetworkConfig(NetworkNames.Mumbai);

async function main() {
  // initializating sdk...
  const sdk = new LiteSdk(
    process.env.WALLET_PRIVATE_KEY, // owner wallet private key
    config.rpcProvider, // rpc provider
    config.bundler, // bundler rpc
    config.chainId, // chain id
    config.contracts.entryPoint, // entry point
    config.contracts.walletFactory, // etherspot wallet factory
    undefined,
  );

  // get EtherspotWallet address...
  const address: string = await sdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
