import { NetworkNames } from '../network';
import { State } from './classes';

export type StateStorageState = Omit<State, 'wallet' | 'network' >;

export interface StateStorage {
  setState(EOAAddress: string, networkName: NetworkNames, state: StateStorageState): Promise<void>;
  getState(EOAAddress: string, networkName: NetworkNames): Promise<StateStorageState>;
}

export interface StateOptions {
  storage?: StateStorage;
}
