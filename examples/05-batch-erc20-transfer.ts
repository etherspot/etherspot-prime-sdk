import { Wallet, ethers, providers } from 'ethers';
import { getVerifyingPaymaster } from '../src/base/VerifyingPaymasterAPI';
import { getGasFee } from '../src/common';
import { ERC20_ABI } from '../src/helpers/ERC20_ABI';
import { printOp } from '../src/common/OperationUtils';
import { LiteSdk } from '../src';

// mumbai contract addresses
const ENTRYPOINT_ADDRESS: string = '0x0576a174D229E3cFA37253523E645A78A0C91B57';
const WALLET_FACTORY_ADDRESS: string = '0x3cf07383654c2569867F02098774eddEEea86573';
const PROVIDER_URL: string = '';
const PRIVATE_KEY: string = '';

const token = '0x15805373121c549ACDDB43333c677CD5492BC5Bf'; // erc20 token address
const t = [
  '0xf24133e601B4d0201510Fcfb975a419C5d2759Be',
  '0xb52A8943B3Fe1ee3583bd98C8c88feBD99D41856',
  '0x4Ab8aB3038056f20dB3159cBd4Ef1f607f1951C2',
]; // recipient address array
const amount = '0.01'; // transfer amount
const paymaster = false; // use paymaster?

async function main() {
  // initializating sdk...
  const provider = new providers.JsonRpcProvider(PROVIDER_URL);
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

  // check initial balance of EtherspotWallet
  const balance = await provider.getBalance(sender);
  console.log('EtherspotWallet balance:', balance.toString());

  // send some funds to EtherspotWallet to prefund
  // await wallet.sendTransaction({
  //   to: sender, // EtherspotWallet address
  //   data: '0x', // no data
  //   value: ethers.utils.parseEther('0.01'), // 0.1 MATIC
  //   gasLimit: ethers.utils.hexlify(50000),
  //   gasPrice: await provider.getGasPrice(),
  // });

  const tkn = ethers.utils.getAddress(token);
  const erc20 = new ethers.Contract(tkn, ERC20_ABI, provider);

  // await erc20.transfer(sender, ethers.utils.parseEther('5'));

  const [sym, dec] = await Promise.all([erc20.symbol(), erc20.decimals()]);
  const amt = ethers.utils.parseUnits(amount, dec);

  let dest: Array<string> = [];
  let data: Array<string> = [];
  t.map((addr) => addr.trim()).forEach((addr) => {
    dest = [...dest, erc20.address];
    data = [...data, erc20.interface.encodeFunctionData('transfer', [ethers.utils.getAddress(addr), amt])];
  });
  console.log(dest);
  console.log(data);
  console.log(`Batch transferring ${amount} ${sym} to ${dest.length} receipients... `);

  const ac = await sdk.getAccountContract();

  const op = await sdk.sign({
    target: '',
    data: ac.interface.encodeFunctionData('executeBatch', [dest, data]),
    ...(await getGasFee(provider)),
  });
  console.log(`Signed UserOp: ${await printOp(op)}`);

  const userOpHash = await sdk.send(op);
  console.log(`UserOperation hash: ${userOpHash}`);

  console.log('Waiting for transaction...');
  const txHash = await sdk.getUserOpReceipt(userOpHash);
  console.log(`Transaction hash: ${txHash}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
