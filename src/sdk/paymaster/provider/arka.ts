import { ethers } from "ethers";
import { PaymasterProvider } from "../interface";
import { ErrorMessage } from "../ErrorMsg";

export class ArkaPaymaster implements PaymasterProvider {
  readonly url: string;
  readonly apiKey: string;
  readonly chainId: number;
  readonly queryParams: string;

  constructor(chainId: number, apiKey: string, paymasterUrl: string) {
    this.url = paymasterUrl;
    this.queryParams = `?apiKey=${apiKey}&chainId=${chainId}`;
    this.apiKey = apiKey;
    this.chainId = chainId;
  }

  /* This method is to get the paymaster address for the given token symbol if available
  * @param tokenSym, the token symbol used as string ex: "USDC"
  */
  async getTokenPaymasterAddress(tokenSym: string) {
    let response = null;
    const entryPointAddressV06 = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
    const context = { token: tokenSym }
    try {
      response = await fetch(`${this.url}/pimlicoAddress${this.queryParams}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ params: [entryPointAddressV06, context] }),
      })
        .then(async (res) => {
          const responseJson = await res.json();
          if (responseJson.error) {
            throw new Error(responseJson.error);
          }
          return responseJson
        })
        .catch((err) => {
          throw new Error(err.message);
        })
    } catch (err) {
      throw new Error(err.message)
    }
    if (response.message) return response.message;
    return response;
  }

  /* This method is to whitelist the addresses given
  * @param addresses, the array of addresses that needs to be whitelisted
  */
  async addWhitelist(addresses: string[]) {
    let response = null;
    if (addresses.length > 10) throw new Error(ErrorMessage.MAX_ADDRESSES);
    const validAddresses = addresses.every(ethers.utils.isAddress);
    if (!validAddresses) throw new Error(ErrorMessage.INVALID_ADDRESS);
    try {
      response = await fetch(`${this.url}/whitelist${this.queryParams}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ params: [addresses] }),
      })
        .then(async (res) => {
          const responseJson = await res.json();
          if (responseJson.error) {
            throw new Error(responseJson.error);
          }
          return responseJson
        })
        .catch((err) => {
          throw new Error(err.message);
        })
    } catch (err) {
      throw new Error(err.message)
    }
    if (response.message) return response.message;
    return response;
  }

  /* This method is to remove whitelisted addresses given
  * @param addresses, the array of addresses that needs to be removed from whitelist
  */
  async removeWhitelist(addresses: string[]) {
    let response = null;
    if (addresses.length > 10) throw new Error(ErrorMessage.MAX_ADDRESSES);
    const validAddresses = addresses.every(ethers.utils.isAddress);
    if (!validAddresses) throw new Error(ErrorMessage.INVALID_ADDRESS);
    try {
      response = await fetch(`${this.url}/removeWhitelist${this.queryParams}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ params: [addresses] }),
      })
        .then(async (res) => {
          const responseJson = await res.json();
          if (responseJson.error) {
            throw new Error(responseJson.error);
          }
          return responseJson
        })
        .catch((err) => {
          throw new Error(err.message);
        })
    } catch (err) {
      throw new Error(err.message)
    }
    if (response.message) return response.message;
    return response;
  }

  /* This method is to check a given address is whitelisted or not
  * @param address, address that needs to be checked if its whitelisted or not
  */
  async checkWhitelist(address: string) {
    let response = null;
    if (!ethers.utils.isAddress(address)) throw new Error(ErrorMessage.INVALID_ADDRESS)
    try {
      response = await fetch(`${this.url}/checkWhitelist${this.queryParams}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ params: [address] }),
      })
        .then(async (res) => {
          const responseJson = await res.json();
          if (responseJson.error) {
            throw new Error(responseJson.error);
          }
          return responseJson
        })
        .catch((err) => {
          throw new Error(err.message);
        })
    } catch (err) {
      throw new Error(err.message)
    }
    if (response.message) return response.message;
    return response;
  }

  /* This method is to deposit the amount for the paymaster to the entryPoint contract
  * @param amountInEth, amount that needs to be deposited in ETH terms 
  */
  async deposit(amountInEth: number) {
    let response = null;
    try {
      response = await fetch(`${this.url}/deposit${this.queryParams}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ params: [amountInEth] }),
      })
        .then(async (res) => {
          const responseJson = await res.json();
          if (responseJson.error) {
            throw new Error(responseJson.error);
          }
          return responseJson
        })
        .catch((err) => {
          throw new Error(err.message);
        })
    } catch (err) {
      throw new Error(err.message)
    }
    if (response.message) return response.message;
    return response;
  }

  // This method is to get the details of the paymaster associated to your apiKey
  async metadata() {
    let response = null;
    try {
      response = await fetch(`${this.url}/metadata${this.queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(async (res) => {
          const responseJson = await res.json();
          if (responseJson.error) {
            throw new Error(responseJson.error);
          }
          return responseJson
        })
        .catch((err) => {
          throw new Error(err.message);
        })
    } catch (err) {
      throw new Error(err.message)
    }
    if (response.message) return response.message;
    return response;
  }

}