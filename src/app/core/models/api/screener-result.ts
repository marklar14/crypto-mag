import { ScreenerSetup } from './screener-setup';

export interface SignalDescription {
  title: string;
  description: string;
  reasoning: string;
  values: Record<string, number | string>;
}

export interface ScreenerResult {
  symbol: string;
  lastPrice: number;
  previousPrice: number;
  changePercent: number;
  volume24h: number;

  rsi?: number;
  macdHist?: number;
  adx?: number;
  bbWidth?: number;
  volumeSpike?: number;

  isAbove200Ema?: boolean;
  isBreakout?: boolean;
  isBreakdown?: boolean;

  signal?: ScreenerSetup;
  matchedSetups: ScreenerSetup[];
}

export interface ScreenerResultResponse {
  symbol: string;
  lastPrice: number;
  previousPrice: number;
  changePercent: number;
  volume24h: number;
  rsi?: number;
  macdHist?: number;
  adx?: number;
  bbWidth?: number;
  volumeSpike?: number;
  isAbove200Ema?: boolean;
  isBreakout?: boolean;
  isBreakdown?: boolean;
  signal?: ScreenerSetup;
  matchedSetups: ScreenerSetup[];
  marketCap?: number;
  description?: SignalDescription;
}

export interface MultiTimeframeData {
  symbol: string;
  tf5m: Partial<ScreenerResultResponse>;
  tf15m: Partial<ScreenerResultResponse>;
  tf1h: Partial<ScreenerResultResponse>;
  tf1d: Partial<ScreenerResultResponse>;
}
