export const сacheSettings = {
  TokenList: {
    timeToLive: 1 * 60 * 60 * 12, // 12 hours
  },
};

export const MethodTypes = {
  GET: 'GET',
  POST: 'POST',
};

export const BACKEND_API_ENDPOINT = 'https://rpc.etherspot.io/data-api';

export const API_ENDPOINTS = {
  GET_ACCOUNT_BALANCES: 'account/balances',
  GET_ACCOUNT_NFTS: 'account/nfts',
  GET_TRANSACTION: 'transactions/transaction',
  GET_TRANSACTIONS: 'transactions',
  GET_ADVANCE_ROUTES_LIFI: 'exchange/getAdvanceRoutesLiFi',
  GET_STEP_TRANSACTIONS: 'exchange/getStepTransactions',
  GET_EXCHANGE_SUPPORTED_ASSETS: 'assets/exchangeSupportedAssets',
  GET_TOKEN_LISTS: 'assets/tokenLists',
  GET_TOKEN_LIST_TOKENS: 'assets/tokenListTokens',
  EXCHANGE_RATES: 'rates/exchangeRates'
}
