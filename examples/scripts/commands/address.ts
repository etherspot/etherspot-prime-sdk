// @ts-ignore
import config from "../../config.json";
import { PrimeSdk } from "../../../src";

export default async function main() {
  const primeSdk = new PrimeSdk({ privateKey: config.signingKey }, { chainId: 80001 })
  const address = await primeSdk.getCounterFactualAddress();

  console.log(`Etherspot address: ${address}`);
}
