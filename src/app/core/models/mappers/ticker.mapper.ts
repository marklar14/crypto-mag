import { TickerApi } from '../api/ticker-api';
import { Ticker } from '../ticker';

export function mapTicker(api: TickerApi): Ticker {
  return {
    symbol: api.symbol,
    lastPrice: api.lastPrice,
    previousPrice: api.previousPrice,
    price24hPcnt: api.price24hPcnt,
    volume24h: api.volume24h,
    markPrice: api.markPrice,
    highPrice24h: api.highPrice24h,
    lowPrice24h: api.lowPrice24h,
    openInterest: api.openInterest,
  };
}

export function mapTickers(apiTickers: TickerApi[]): Ticker[] {
  return apiTickers.map(mapTicker);
}
