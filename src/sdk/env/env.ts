import { NetworkOptions } from '../network';
import { EnvNames, SUPPORTED_ENVS } from './constants';

export class Env {
  static defaultName: EnvNames = EnvNames.MainNets;

  static prepare(env: EnvNames | Env): Env {
    let partial: Env = null;

    if (env) {
      switch (typeof env) {
        case 'string':
          partial = SUPPORTED_ENVS[env];
          break;

        case 'object':
          if (env.networkOptions) {
            partial = env;
          }
          break;
      }

      if (!partial || !partial.networkOptions) {
        throw new Error(`Unsupported env`);
      }
    } else {
      partial = SUPPORTED_ENVS[this.defaultName || EnvNames.TestNets];
    }

    return new Env(partial);
  }
  networkOptions: NetworkOptions;

  constructor(partial: Partial<Env>) {
    Object.assign(this, partial);
  }
}
