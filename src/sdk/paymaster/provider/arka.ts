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

  async getTokenPaymasterAddress(tokenSym: string) {
    let response = null;
    const entryPointAddress = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
    const context = { token: tokenSym }
    try {
      response = await fetch(`${this.url}/pimlicoAddress${this.queryParams}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ params: [entryPointAddress, context] }),
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