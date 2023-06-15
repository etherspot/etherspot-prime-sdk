import { utils } from 'ethers';
import { switchMap } from 'rxjs/operators';
import { Service, HeaderNames } from '../common';
import { Session } from './classes';
import { createSessionMessage } from './utils';
import { SessionOptions, SessionStorageLike } from './interfaces';
import { SessionStorage } from './session.storage';

export class SessionService extends Service {
  private readonly storage: SessionStorageLike;
  private session: Session = null;

  constructor(options: SessionOptions = {}) {
    super();

    const { storage } = options;

    this.storage = storage ? storage : new SessionStorage();
  }

  get headers(): { [key: string]: any } {
    return this.session
      ? {
          [HeaderNames.AuthToken]: this.session.token,
        }
      : {};
  }

  get sessionTtl(): number {
    return this.session ? this.session.ttl : undefined;
  }

  async verifySession(): Promise<void> {
    await this.restoreSession();

    if (this.session && !this.session.verify()) {
      this.session = null;
    }

    if (!this.session) {
      await this.createSession();
    } else {
      await this.refreshSession();
    }
  }

  async refreshSession(): Promise<void> {
    this.session.refresh();

    await this.storeSession();
  }

  async createSession(ttl?: number, fcmToken?: string): Promise<Session> {
    const { walletService } = this.services;
    const { walletAddress } = walletService;

    let session: Session;
    let error: Error;
    let signerAddress: string;

    try {
      const message = createSessionMessage("Etherspot 4337");
      const messageHash = utils.arrayify(utils.hashMessage(message));

      const signature = await walletService.signMessage(message);

      signerAddress = utils.recoverAddress(messageHash, signature);
    } catch (err) {
      session = null;
      error = err;
    }

    if (session) {
      delete session.account;

      session.refresh();

      if (signerAddress !== walletAddress) {
        const { providerType } = walletService.wallet;

        walletService.wallet$.next({
          address: signerAddress,
          providerType,
        });
      }
    }

    if (error) {
      throw error;
    }

    this.session = session;

    await this.storeSession();

    return session;
  }

  protected onInit() {
    const { walletAddress$ } = this.services.walletService;

    this.addSubscriptions(
      walletAddress$
        .pipe(switchMap(() => this.restoreSession())) //
        .subscribe(),
    );
  }

  private async storeSession(): Promise<void> {
    const { walletService } = this.services;
    const { walletAddress } = walletService;

    await this.storage.setSession(walletAddress, this.session ? this.session.toStoredSession() : null);
  }

  private async restoreSession(): Promise<void> {
    let session: Session = null;

    const { walletService } = this.services;
    const { walletAddress } = walletService;

    if (walletAddress) {
      const storedSession = await this.storage.getSession(walletAddress);

      session = storedSession ? Session.fromStoredSession(storedSession) : null;
    }

    this.session = session;
  }
}
