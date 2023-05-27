import { plainToClass } from 'class-transformer';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Service } from '../common';
import { Account } from '../account';
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

  get walletAddress$(): Observable<string> {
    return this.services.walletService.walletAddress$;
  }

  get walletAddress(): string {
    return this.services.walletService.walletAddress;
  }

  get account$(): BehaviorSubject<Account> {
    return this.services.accountService.account$;
  }

  get account(): Account {
    return this.services.accountService.account;
  }

  get accountAddress$(): Observable<string> {
    return this.services.accountService.accountAddress$;
  }

  get accountAddress(): string {
    return this.services.accountService.accountAddress;
  }

  get network(): Network {
    return this.services.networkService.network;
  }

  get network$(): BehaviorSubject<Network> {
    return this.services.networkService.network$;
  }

  restore(state: StateStorageState): this {
    const {
      accountService: { account$ },
    } = this.services;

    if (state) {
      state = plainToClass(State, state);
      const { account } = state;

      account$.next(account);
    }

    return this;
  }

  dump(): StateStorageState {
    return {
      account: this.account,
    };
  }

  protected onInit() {
    const { storage } = this.options || {};

    const {
      walletService: { wallet$, wallet },
      accountService: { account$ },
      networkService: { network$, network },
    } = this.services;

    const callback = () => {
      this.addSubscriptions(
        combineLatest([
          wallet$, //
          account$,
          network$,
        ])
          .pipe(
            map(
              ([
                wallet, //
                account,
                network,
              ]: [
                State['wallet'], //
                State['account'],
                State['network'],
              ]) => ({
                wallet, //
                account,
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
        const walletAddress = wallet && wallet.address ? wallet.address : null;
        const networkName = network && network.name ? network.name : null;

        if (walletAddress && networkName) {
          const state = await storage.getState(walletAddress, networkName);

          this.restore(state);
        }
      }, callback);
    } else {
      callback();
    }
  }
}
