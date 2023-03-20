import { Wallet, ethers, providers } from 'ethers';
import { LiteSdk } from '../src';

// mumbai contract addresses
const ENTRYPOINT_ADDRESS = '0x1D9a2CB3638C2FC8bF9C01D088B79E75CD188b17';
const REGISTRY_ADDRESS = '0x7EB3A038F25B9F32f8e19A7F0De83D4916030eFa';
// const ACCOUNT_FACTORY_ADDRESS = '<deployed_account_factory_address>';

async function main() {
  // initializating sdk...
  const provider = new providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/<ALCHEMY_API_KEY>');
  const wallet = new Wallet('<PRIVATE_KEY>', provider);
  const sdk = new LiteSdk(
    wallet, // wallet
    'https://mumbai-bundler.etherspot.io', // bundler rpc
    80001, // chain id
    ENTRYPOINT_ADDRESS, // entry point
    REGISTRY_ADDRESS, // personal account registry
    REGISTRY_ADDRESS, // personal account registry (wallet factory)
  );

  console.log(`Wallet address: ${wallet.address}`);

  console.log('here 2');

  // sanity check for init code
  const initCode = await sdk.getAccountInitCodePAR();
  console.log(`initcode: ${initCode}`);

  console.log('here 3');

  // creating and signing userOp...
  const userOp = await sdk.sign({
    target: '0x3D8b4eE7a40d8dA040Ecd1D276219Ff7ec6B986a', // recipient
    value: ethers.utils.parseEther('0.0001'), // amount of native asset to send,
    data: '0x', // calldata is empty since we just want to transfer ether
  });
  userOp.initCode = await sdk.getAccountInitCodePAR();
  console.log(`Signed userOp: ${userOp}`);

  console.log('here 4');

  // sending to the bundler...
  const txHash = await sdk.send(userOp);
  console.log(`Transaction hash: ${txHash}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
