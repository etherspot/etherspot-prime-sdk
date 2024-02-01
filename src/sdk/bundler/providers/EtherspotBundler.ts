import { Exception } from "../../common";
import { getNetworkConfig } from "../../network/constants";
import { BundlerProvider } from "../interface";

export class EtherspotBundler implements BundlerProvider {
  readonly url: string;
  readonly apiKey: string;
  readonly chainId: string;

  constructor(chainId: number, apiKey?: string, bundlerUrl?: string) {
    if (!bundlerUrl) {
      const networkConfig = getNetworkConfig(chainId);
      if (!networkConfig || networkConfig.bundler == '') throw new Exception('No bundler url provided')
      bundlerUrl = networkConfig.bundler;
    }
    if (apiKey) {
      if (bundlerUrl.includes('?api-key=')) this.url = bundlerUrl + apiKey;
      else this.url = bundlerUrl + '?api-key=' + apiKey;
    }
    else this.url = bundlerUrl;
    this.apiKey = apiKey;
  }
}