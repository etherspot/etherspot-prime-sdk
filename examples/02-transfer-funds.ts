import { BigNumber, Wallet, ethers, providers } from 'ethers';
import { LiteSdk } from '../src';

// mumbai contract addresses
const ENTRYPOINT_ADDRESS: string = '0x0576a174D229E3cFA37253523E645A78A0C91B57';
const WALLET_FACTORY_ADDRESS: string = '0x3cf07383654c2569867F02098774eddEEea86573';
const PROVIDER_URL: string = '';
const PRIVATE_KEY: string = '';

async function main() {
  // initializating sdk...
  const provider = new providers.JsonRpcProvider(PROVIDER_URL);
  const wallet = new Wallet(PRIVATE_KEY, provider);
  const sdk = new LiteSdk(
    wallet, // wallet
    'https://mumbai-bundler.etherspot.io', // bundler rpc
    80001, // chain id
    ENTRYPOINT_ADDRESS, // entry point
    WALLET_FACTORY_ADDRESS, // etherspot wallet factory
  );

  // get address of EtherspotWallet
  const address = await sdk.getCounterFactualAddress();
  console.log('EtherspotWallet deployed at:', address);

  // check initial balance of EtherspotWallet
  const balance = await provider.getBalance(address);
  console.log('EtherspotWallet balance:', balance.toString());

  // // send some funds to EtherspotWallet to prefund
  // await wallet.sendTransaction({
  //   to: address, // EtherspotWallet address
  //   data: '0x', // no data
  //   value: ethers.utils.parseEther('0.01'), // 0.1 MATIC
  //   gasLimit: ethers.utils.hexlify(50000),
  //   gasPrice: await provider.getGasPrice(),
  // });

  // creating and signing userOp...
  const userOp = await sdk.sign({
    target: '', // recipient
    value: ethers.utils.parseEther('0.0001'), // amount of native asset to send,
    data: '0x', // calldata is empty since we just want to transfer ether
  });

  // sending to the bundler...
  const uoHash = await sdk.send(userOp);

  console.log('Waiting for transaction...');
  const txHash = await sdk.getUserOpReceipt(uoHash);
  console.log(`Transaction hash: ${txHash}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
