import { plainToClass } from 'class-transformer';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Service } from '../common';
import { Wallet } from '../wallet';
import { State } from './classes';
import { StateOptions, StateStorageState } from './interfaces';
import { Network } from '../network';

export class StateService extends Service implements State {
  readonly state$ = new BehaviorSubject<State>(null);

  constructor(private options: StateOptions = {}) {
    super();
  }

  get state(): State {
    return this.state$.value;
  }

  get wallet$(): BehaviorSubject<Wallet> {
    return this.services.walletService.wallet$;
  }

  get wallet(): Wallet {
    return this.services.walletService.wallet;
  }

  get EOAAddress$(): Observable<string> {
    return this.services.walletService.EOAAddress$;
  }

  get EOAAddress(): string {
    return this.services.walletService.EOAAddress;
  }

  get network(): Network {
    return this.services.networkService.network;
  }

  get network$(): BehaviorSubject<Network> {
    return this.services.networkService.network$;
  }

  restore(state: StateStorageState): this {

    if (state) {
      state = plainToClass(State, state);
    }

    return this;
  }

  protected onInit() {
    const { storage } = this.options || {};

    const {
      walletService: { wallet$, wallet },
      networkService: { network$, network },
    } = this.services;

    const callback = () => {
      this.addSubscriptions(
        combineLatest([
          wallet$, //
          network$,
        ])
          .pipe(
            map(
              ([
                wallet, //
                network,
              ]: [
                State['wallet'], //
                State['network'],
              ]) => ({
                wallet, //
                network,
              }),
            ),
          )
          .subscribe(this.state$),

        !storage
          ? null
          : this.state$
              .pipe(
                filter(
                  (state) =>
                    state && //
                    state.wallet &&
                    state.wallet.address &&
                    state.network &&
                    state.network.name &&
                    true,
                ),
                tap((state) => {
                  const { wallet, network, ...storageState } = state;

                  this.error$.catch(
                    () => storage.setState(wallet.address, network.name, storageState), //
                  );
                }),
              )
              .subscribe(),
      );
    };

    if (storage) {
      this.error$.catch(async () => {
        const EOAAddress = wallet && wallet.address ? wallet.address : null;
        const networkName = network && network.name ? network.name : null;

        if (EOAAddress && networkName) {
          const state = await storage.getState(EOAAddress, networkName);

          this.restore(state);
        }
      }, callback);
    } else {
      callback();
    }
  }
}
