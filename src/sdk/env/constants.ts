import { NetworkNames } from '../network';
import { Env } from './env';

export enum EnvNames {
  MainNets = 'mainnets',
  TestNets = 'testnets',
}

export const SUPPORTED_ENVS: { [key: string]: Env } = {
  [EnvNames.MainNets]: {
    networkOptions: {
      supportedNetworkNames: [
        // NetworkNames.Mainnet, //
      ],
    },
  },
  [EnvNames.TestNets]: {
    networkOptions: {
      supportedNetworkNames: [
        // NetworkNames.Goerli,
        NetworkNames.Mumbai,
      ],
    },
  },
};
