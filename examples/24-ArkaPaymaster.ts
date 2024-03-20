import { ArkaPaymaster } from "../src";
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const arka_api_key = 'arka_public_key';
  const arka_url = 'https://arka.etherspot.io'; // Only testnets are available, if you need further assistance in setting up a paymaster service for your dapp, please reach out to us on discord or https://etherspot.fyi/arka/intro

  // initializating sdk...
  const arkaPaymaster = new ArkaPaymaster(Number(process.env.CHAIN_ID), arka_api_key, arka_url);

  console.log(await arkaPaymaster.metadata());
  console.log(await arkaPaymaster.getTokenPaymasterAddress("eUSDC"))
  console.log(await arkaPaymaster.addWhitelist(["0xB3aF6CFDDc444B948132753AD8214a20605692eF"]));
  console.log(await arkaPaymaster.removeWhitelist(["0xB3aF6CFDDc444B948132753AD8214a20605692eF"]));
  console.log(await arkaPaymaster.checkWhitelist("0xB3aF6CFDDc444B948132753AD8214a20605692eF"));
  console.log(await arkaPaymaster.deposit(0.001));
}

main()
  .catch(console.error)
  .finally(() => process.exit());