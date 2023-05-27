import { BytesLike, providers, Wallet } from 'ethers';
import { UniqueSubject } from '../../common';
import { NetworkNames } from '../../network';

export interface WalletProvider {
  readonly type?: string;
  readonly wallet?: Wallet;
  readonly address: string;
  readonly address$?: UniqueSubject<string>;
  readonly networkName?: NetworkNames;
  readonly networkName$?: UniqueSubject<NetworkNames>;

  signMessage(message: BytesLike): Promise<string>;
  sendTransaction(transaction: providers.TransactionRequest): Promise<providers.TransactionResponse>
}

export interface Web3Provider {
  send(payload: any, callback: (err: any, response?: any) => any): any;
}

export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}
export interface Web3eip1193Provider {
  request(args: RequestArguments): any;
}

export interface WalletConnectConnector {
  accounts: string[];
  chainId: number;
  signPersonalMessage(params: any[]): Promise<any>;
  sendTransaction(transaction: providers.TransactionRequest): Promise<any>;
  on(event: string, callback: (error: Error | null, payload: any | null) => void): void;
}

export interface WalletLike {
  privateKey: string;
}

export type WalletProviderLike = WalletLike;
