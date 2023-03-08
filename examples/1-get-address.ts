import { Wallet, providers } from 'ethers';
import { LiteSdk } from '../src';

async function main() {
  const provider = new providers.JsonRpcProvider(process.env.PROVIDER);
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  const sdk = new LiteSdk(
    wallet,
    'mumbai-aa.etherspot.dev',
    80001,
    '0x1D9a2CB3638C2FC8bF9C01D088B79E75CD188b17',
    '0xPeRs0Na1AcC0Un7R3g157ry01233444555666777',
    '0x1D9a2CB3638C2FC8bF9C01D088B79E75CD188b17',
  );
  const address = await sdk.getCounterFactualAddress();
  console.log(`AA-Wallet address: ${address}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
