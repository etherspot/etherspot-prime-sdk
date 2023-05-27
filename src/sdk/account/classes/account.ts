import { plainToClass } from 'class-transformer';
import { Type } from 'class-transformer';
import { Synchronized } from '../../common';
import { AccountTypes, AccountStates } from '../constants';

export class Account extends Synchronized {
  static fromPlain(plain: Partial<Account>): Account {
    return plainToClass(Account, plain);
  }

  address: string;

  type: AccountTypes;

  state: AccountStates;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
