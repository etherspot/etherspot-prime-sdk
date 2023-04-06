import { Wallet, ethers, providers } from 'ethers';
import { getVerifyingPaymaster } from '../src/base/VerifyingPaymasterAPI';
import { getGasFee } from '../src/common/getGasFee';
import { printOp } from '../src/common/OperationUtils';
import { LiteSdk } from '../src';

// mumbai contract addresses
const ENTRYPOINT_ADDRESS: string = '0x0576a174D229E3cFA37253523E645A78A0C91B57';
const WALLET_FACTORY_ADDRESS: string = '0x3cf07383654c2569867F02098774eddEEea86573';
const PROVIDER_URL: string = '';
const PRIVATE_KEY: string = '';

export default async function main() {
  const t = [
    '0xf24133e601B4d0201510Fcfb975a419C5d2759Be',
    '0xb52A8943B3Fe1ee3583bd98C8c88feBD99D41856',
    '0x4Ab8aB3038056f20dB3159cBd4Ef1f607f1951C2',
  ]; // recipient address array
  const amount = '0.01'; // transfer amount
  const paymaster = false; // use paymaster?
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
  // logic for paymaster implementation
  const paymasterAPI = paymaster ? getVerifyingPaymaster(process.env.PAYMASTER_URL, ENTRYPOINT_ADDRESS) : undefined;
  const wallet = new Wallet(PRIVATE_KEY, provider);
  const sdk = new LiteSdk(
    wallet, // wallet
    'https://mumbai-bundler.etherspot.io', // bundler rpc
    80001, // chain id
    ENTRYPOINT_ADDRESS, // entry point
    WALLET_FACTORY_ADDRESS, // etherspot wallet factory
  );

  const sender = await sdk.getCounterFactualAddress();

  const balance = await provider.getBalance(sender);
  console.log('EtherspotWallet balance:', balance.toString());

  // // send some funds to EtherspotWallet to prefund
  // await wallet.sendTransaction({
  //   to: sender, // EtherspotWallet address
  //   data: '0x', // no data
  //   value: ethers.utils.parseEther('0.01'), // 0.1 MATIC
  //   gasLimit: ethers.utils.hexlify(50000),
  //   gasPrice: await provider.getGasPrice(),
  // });

  const ac = await sdk.getAccountContract();
  const value = ethers.utils.parseEther(amount);

  let dest: Array<string> = [];
  let data: Array<string> = [];
  t.map((addr) => addr.trim()).forEach(async (addr) => {
    dest = [...dest, sender];
    console.log(`dest: ${dest}`);
    data = [...data, await sdk.encodeExecute(ethers.utils.getAddress(addr), value, '0x')];
  });
  console.log(`Batch transferring ${amount} MATIC to ${dest.length} receipients... `);

  const op = await sdk.sign({
    target: '',
    data: ac.interface.encodeFunctionData('executeBatch', [dest, data]),
    ...(await getGasFee(provider)),
  });
  console.log(`Signed UserOp: ${await printOp(op)}`);

  const uoHash = await sdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);

  console.log('Waiting for transaction...');
  const txHash = await sdk.getUserOpReceipt(uoHash);
  console.log(`Transaction hash: ${txHash}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
