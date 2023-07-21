import { ethers } from "ethers";
import { ERC20_ABI } from '../../../src/sdk/helpers/abi/ERC20_ABI';
// @ts-ignore
import config from "../../config.json";
import { PrimeSdk } from "../../../src";
import { printOp } from "../../../src/sdk/common/OperationUtils";
import { sleep } from "../../../src/sdk/common";

export default async function main(
  tkn: string,
  s: string,
  amt: string,
) {
  const primeSdk = new PrimeSdk({ privateKey: config.signingKey }, { chainId: config.chainId, rpcProviderUrl: config.rpcProviderUrl })
  const address = await primeSdk.getCounterFactualAddress();
  console.log(`Etherspot address: ${address}`)
  const provider = new ethers.providers.JsonRpcProvider(config.rpcProviderUrl);
  const token = ethers.utils.getAddress(tkn);
  const spender = ethers.utils.getAddress(s);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = ethers.utils.parseUnits(amt, decimals);
  const approveData = erc20.interface.encodeFunctionData("approve", [spender, amount]);
  console.log(`Approving ${amt} ${symbol}...`);
  // clear the transaction batch
  await primeSdk.clearUserOpsFromBatch();

  await primeSdk.addUserOpsToBatch({to: erc20.address, data: approveData});
  console.log(`Added transaction to batch`);

  const op = await primeSdk.estimate();
  console.log(`Estimated UserOp: ${await printOp(op)}`);

  // sign the userOp and sending to the bundler...
  const uoHash = await primeSdk.send(op);
  console.log(`UserOpHash: ${uoHash}`);

  // get transaction hash...
  console.log('Waiting for transaction...');
  let userOpsReceipt = null;
  const timeout = Date.now() + 60000; // 1 minute timeout
  while((userOpsReceipt == null) && (Date.now() < timeout)) {
    await sleep(2);
    userOpsReceipt = await primeSdk.getUserOpReceipt(uoHash);
  }
  console.log('\x1b[33m%s\x1b[0m', `Transaction Receipt: `, userOpsReceipt);
}
