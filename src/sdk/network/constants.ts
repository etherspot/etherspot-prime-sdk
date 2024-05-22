import { NetworkConfig } from ".";

export enum NetworkNames {
  Sepolia = 'sepolia',
}

export const SupportedNetworks = [11155111]

export const NETWORK_NAME_TO_CHAIN_ID: {
  [key: string]: number;
} = {
  [NetworkNames.Sepolia]: 11155111,
};

export const onRamperAllNetworks = ['OPTIMISM', 'POLYGON', 'ARBITRUM', 'FUSE', 'GNOSIS', 'ETHEREUM']

export const Networks: {
  [key: string]: NetworkConfig
} = {
  [11155111]: {
    chainId: 11155111,
    bundler: 'https://testnet-rpc.etherspot.io/v2/11155111',
    contracts: {
      entryPoint: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
      walletFactory: {
        etherspot: '0x77E4288A4b15893F520F15C262a07dF9866904e4',
        zeroDev: '',
        simpleAccount: '',
      },
      bootstrap: '0x4f695ad7694863c8280FCEBf2Cb220E361ce4eA0',
      multipleOwnerECDSAValidator: '0x1E714c551Fe6234B6eE406899Ec3Be9234Ad2124',
    },
  }
};

interface ISafeConstant {
  MultiSend: Record<string, string>;
}

export const Safe: ISafeConstant = {
  // From https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.3.0/multi_send.json
  MultiSend: {
    "1": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "3": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "5": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "10": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "11": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "12": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "18": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "25": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "28": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "30": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "31": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "39": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "40": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "41": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "42": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "43": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "44": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "46": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "50": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "51": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "56": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "57": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "61": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "63": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "69": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "71": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "81": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "82": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "83": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "97": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "100": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "106": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "108": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "109": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "111": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "122": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "123": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "137": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "148": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "155": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "169": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "195": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "204": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "246": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "250": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "252": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "255": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "280": "0x0dFcccB95225ffB03c6FBB2559B530C2B7C8A912",
    "288": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "291": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "300": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "321": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "322": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "324": "0x0dFcccB95225ffB03c6FBB2559B530C2B7C8A912",
    "336": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "338": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "420": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "424": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "570": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "588": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "592": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "595": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "599": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "686": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "787": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "919": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1001": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1008": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1030": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1088": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1101": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1111": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1112": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1115": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1116": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1230": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1231": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1284": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1285": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1287": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1294": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1442": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1559": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1663": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1807": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1890": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1891": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1984": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1998": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2001": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2002": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2008": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2019": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2020": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2021": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2221": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2222": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "2358": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "3737": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "3776": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4002": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4202": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4337": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4460": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4689": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "4918": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "4919": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "5000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "5003": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "5700": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "6102": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "7001": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "7332": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "7341": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "7700": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "8192": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "8194": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "8217": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "8453": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "9000": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "9001": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "9728": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10001": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10081": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10200": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "10242": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "10243": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "11235": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "11437": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "11891": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "12357": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "13337": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "17000": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "17172": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "18231": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "23294": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "23295": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "34443": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "42161": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "42170": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "42220": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "43113": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "43114": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "43288": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "44787": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "45000": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "47805": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "54211": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "56288": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "57000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "58008": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "59140": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "59144": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "71401": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "71402": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "73799": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "80002": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "80085": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "81457": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "84531": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "84532": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "103454": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "167008": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "200101": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "200202": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "333999": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "421611": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "421613": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "421614": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "534351": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "534352": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "534353": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "622277": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "713715": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "7777777": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "11155111": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "11155420": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "168587773": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "222000222": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "245022926": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "245022934": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "333000333": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "999999999": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1313161554": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1313161555": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "1666600000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "1666700000": "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    "11297108099": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    "11297108109": "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761"
  },
};

export const KERNEL_IMPL_ADDRESS = "0xf048AD83CB2dfd6037A43902a2A5Be04e53cd2Eb";
export const KERNEL_VALIDATOR_ADDRESS = "0xd9AB5096a832b9ce79914329DAEE236f8Eea0390";

export const CHAIN_ID_TO_NETWORK_NAME: { [key: number]: NetworkNames } = Object.entries(
  NETWORK_NAME_TO_CHAIN_ID,
).reduce(
  (result, [networkName, chainId]) => ({
    ...result,
    [chainId]: networkName,
  }),
  {},
);

export function getNetworkConfig(key: number) {
  return Networks[key];
}