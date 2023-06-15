import fs from 'fs/promises';
import path from "path";
import prettier from "prettier";
import { ethers } from "ethers";

const INIT_CONFIG = {
  rpcProviderUrl: "https://mumbai-bundler.etherspot.io",
  signingKey: new ethers.Wallet(ethers.utils.randomBytes(32)).privateKey,
  chainId: 80001,
  paymaster: {
    rpcUrl: "",
    context: {},
  },
};
const CONFIG_PATH = path.resolve(__dirname, "../config.json");

async function main() {
  return fs.writeFile(
    CONFIG_PATH,
    prettier.format(JSON.stringify(INIT_CONFIG, null, 2), { parser: "json" })
  );
}

main()
  .then(() => console.log(`Config written to ${CONFIG_PATH}`))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
