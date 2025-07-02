import { TickerApi } from './api/ticker-api';

export type Ticker = Pick<
  TickerApi,
  | 'symbol'
  | 'lastPrice'
  | 'previousPrice'
  | 'price24hPcnt'
  | 'volume24h'
  | 'markPrice'
  | 'highPrice24h'
  | 'lowPrice24h'
  | 'openInterest'
>;
