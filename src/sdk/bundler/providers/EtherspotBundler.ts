import { getNetworkConfig } from "../../network/constants";
import { BundlerProvider } from "../interface";

export class EtherspotBundler implements BundlerProvider {
  readonly url: string;
  readonly apiKey: string;
  readonly chainId: string;

  constructor(chainId: number, apiKey?: string, bundlerUrl?: string) {
    if (!bundlerUrl) {
      const networkConfig = getNetworkConfig(chainId);
      bundlerUrl = networkConfig.bundler;
    }
    if (apiKey) this.url = bundlerUrl + '?api-key=' + apiKey;
    else this.url = bundlerUrl;
    this.apiKey = apiKey;
  }
}