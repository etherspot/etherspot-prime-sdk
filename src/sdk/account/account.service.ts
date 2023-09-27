import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeaderNames, Service, SynchronizedSubject, keccak256 } from '../common';
import {
  Account,
} from './classes';
import { AccountTypes } from './constants';

export class AccountService extends Service {
  readonly account$ = new SynchronizedSubject<Account>();
  readonly accountAddress$: Observable<string>;

  constructor() {
    super();

    this.accountAddress$ = this.account$.observeKey('address');
  }

  get account(): Account {
    return this.account$.value;
  }

  get accountAddress(): string {
    return this.account ? this.account.address : null;
  }

  get headers(): { [key: string]: any } {
    return this.services.walletService.walletAddress
      ? {
        [HeaderNames.AnalyticsToken]: keccak256(this.services.walletService.walletAddress),
      }
      : {};
  }

  joinContractAccount(address: string): void {
    this.account$.next(
      Account.fromPlain({
        address,
        type: AccountTypes.Contract,
        synchronizedAt: null,
      }),
    );
    
  }

  isContractAccount(): boolean {
    return this.account.type === AccountTypes.Contract;
  }

  protected onInit(): void {
    const { walletService, networkService } = this.services;

    this.addSubscriptions(
      combineLatest([
        walletService.walletAddress$, //
        networkService.chainId$,
      ])
        .pipe(
          map(([address, chainId]) =>
            !address || !chainId
              ? null
              : Account.fromPlain({
                  address,
                  type: AccountTypes.Key,
                  synchronizedAt: null,
                }),
          ),
        )
        .subscribe(this.account$),
    );
  }
}
