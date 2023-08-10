import { AccountService } from './account';
import { ApiService } from './api';
import { ErrorSubject, Service } from './common';
import { DataService } from './data';
import { NetworkService } from './network';
import { SessionService } from './session';
import { StateService } from './state';
import { WalletService } from './wallet';

export class Context {
  readonly error$ = new ErrorSubject();

  private readonly attached: Service[] = [];

  constructor(
    readonly services: {
      accountService: AccountService;
      sessionService: SessionService;
      stateService: StateService;
      walletService: WalletService;
      networkService: NetworkService;
      apiService: ApiService;
      dataService: DataService,
    },
  ) {
    const items = [...Object.values(services)];

    for (const item of items) {
      this.attach(item);
    }
  }

  attach<T extends Service>(service: T): void {
    this.attached.push(service);
    service.init(this);
  }

  destroy(): void {
    for (const attached of this.attached) {
      attached.destroy();
    }
  }
}
