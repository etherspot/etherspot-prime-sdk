import { AccountService } from './account';
import { ErrorSubject, Service } from './common';
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
