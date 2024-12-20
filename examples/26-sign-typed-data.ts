import { ethers } from "ethers";
import { EtherspotBundler, MessagePayload, PrimeSdk } from "../src";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {

  const bundlerApiKey = "eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjMxMDZiOGY2NTRhZTRhZTM4MGVjYjJiN2Q2NDMzMjM4IiwiaCI6Im11cm11cjEyOCJ9";

  const primeSdk = new PrimeSdk({ privateKey: process.env.WALLET_PRIVATE_KEY }, {
    chainId: Number(process.env.CHAIN_ID),
    bundlerProvider: new EtherspotBundler(Number(process.env.CHAIN_ID), bundlerApiKey)
  });

  const address: string = await primeSdk.getCounterFactualAddress();
  console.log('\x1b[33m%s\x1b[0m', `EtherspotWallet address: ${address}`);

  const types = {
    Mail: [
      {name: 'from', type: 'Person'},
      {name: 'to', type: 'Person'},
      {name: 'contents', type: 'string'},
    ],
    Person: [
      {name: 'name', type: 'string'},
      {name: 'wallet', type: 'address'}
    ],
  }

  const domainSeparator = {
    name: "Ether Mail",
    version: "1",
    chainId: 1,
    verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
  }

  const typedData: MessagePayload = {
    domain: domainSeparator,
    primaryType: 'Person',
    types
  };

  const message = {
    from: {
      name: "Cow",
      wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
    },
    to: {
      name: "Bob",
      wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
    },
    contents: "Hello, Bob!"
  }

  const signature = await primeSdk.signTypedData(typedData, message);
  console.log('signature:: ', signature);

  // will work only if wallet is deployed already.
  const signer = ethers.utils.verifyTypedData(
    domainSeparator,
    types,
    message,
    signature
  );
  console.log('signer:: ', signer);
}

main()
  .catch(console.error)
  .finally(() => process.exit());