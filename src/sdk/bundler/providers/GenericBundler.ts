import { BundlerProvider } from "../interface";


export class GenericBundler implements BundlerProvider {
  readonly url: string;
  constructor(bundlerUrl: string) {
    this.url = bundlerUrl;
  }
}