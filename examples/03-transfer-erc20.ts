import { Wallet, ethers, providers } from 'ethers';
import { getVerifyingPaymaster } from '../src/base/VerifyingPaymasterAPI';
import { ERC20_ABI } from '../src/helpers/ERC20_ABI';
import { getGasFee } from '../src/common';
import { printOp } from '../src/common/OperationUtils';
import { LiteSdk } from '../src';

// mumbai contract addresses
const ENTRYPOINT_ADDRESS: string = '0x0576a174D229E3cFA37253523E645A78A0C91B57';
const WALLET_FACTORY_ADDRESS: string = '0x3cf07383654c2569867F02098774eddEEea86573';
const PROVIDER_URL: string = '';
const PRIVATE_KEY: string = '';

async function main() {
  const tkn = '0x15805373121c549ACDDB43333c677CD5492BC5Bf'; // erc20 token address
  const receiver = '0xf24133e601B4d0201510Fcfb975a419C5d2759Be';
  const amount = '0.01';
  const paymaster = false; // use paymaster?
  const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
  const paymasterAPI = paymaster ? getVerifyingPaymaster(process.env.PAYMASTER_URL, ENTRYPOINT_ADDRESS) : undefined;
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

  const token = ethers.utils.getAddress(tkn);
  const to = ethers.utils.getAddress(receiver);
  const erc20 = new ethers.Contract(token, ERC20_ABI, wallet);

  // transfer some of the ERC20 token to the EtherspotWallet
  // await erc20.transfer(address, ethers.utils.parseEther('5'));
  console.log(`DummyToken balance of EtherspotWallet: ${await erc20.balanceOf(address)}`);

  const [symbol, decimals] = await Promise.all([erc20.symbol(), erc20.decimals()]);
  const amt = ethers.utils.parseUnits(amount, decimals);
  console.log(`Transferring ${amount} ${symbol}...`);

  const op = await sdk.sign({
    target: erc20.address,
    data: erc20.interface.encodeFunctionData('transfer', [to, amt]),
    ...(await getGasFee(provider)),
  });
  console.log(`Signed UserOperation: ${await printOp(op)}`);

  const uoHash = await sdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);

  console.log('Waiting for transaction...');
  const txHash = await sdk.getUserOpReceipt(uoHash);
  console.log(`Transaction hash: ${txHash}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
