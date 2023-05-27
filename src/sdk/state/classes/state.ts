import { Type } from 'class-transformer';
import { Network } from '../../network';
import { Account } from '../../account';
import { Wallet } from '../../wallet';

export class State {
  wallet: Wallet;

  @Type(() => Account)
  account: Account;

  network: Network;

}
