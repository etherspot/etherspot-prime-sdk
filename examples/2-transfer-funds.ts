import { Wallet, ethers, providers } from 'ethers';
import { LiteSdk } from '../src';

async function main() {
  // initializating sdk...
  const provider = new providers.JsonRpcProvider(process.env.PROVIDER);
  const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
  const sdk = new LiteSdk(
    wallet,
    'mumbai-aa.etherspot.dev',
    80001,
    '0x1D9a2CB3638C2FC8bF9C01D088B79E75CD188b17',
    '0x1D9a2CB3638C2FC8bF9C01D088B79E75CD188b17'
  );

  // creating and signing userOp...
  const userOp = await sdk.sign({
    target: '0x7220A66Ed094F0C7c04e221ff5b436bD304776A0', // recipient
    value: ethers.utils.parseEther('0.0001'), // amount of native asset to send,
    data: '0x', // calldata is empty since we just want to transfer ether
  });
  console.log(`Signed userOp: ${userOp}`);

  // sending to the bundler...
  const txHash = await sdk.send(userOp);
  console.log(`Transaction hash: ${txHash}`)
}


main()
  .catch(console.error)
  .finally(() => process.exit());