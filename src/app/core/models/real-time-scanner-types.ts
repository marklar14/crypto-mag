import { SignalFilter, StrengthFilter } from './signal-types';

export const TIMEFRAMES = {
  TF1M: 'tf1m',
  TF5M: 'tf5m',
  TF15M: 'tf15m',
  TF1H: 'tf1h',
  TF4H: 'tf4h',
} as const;

export type Timeframe = (typeof TIMEFRAMES)[keyof typeof TIMEFRAMES];

export interface RealTimeScannerConfig {
  scanInterval: number;
  signalThreshold: number;
  maxSignals: number;
  selectedTimeframes: Timeframe[];
  adaptiveThresholds: boolean;
  tickAnalysisEnabled: boolean;
}

export interface RealTimeScannerFilters {
  signalType: SignalFilter;
  strength: StrengthFilter;
  volumeSpike: boolean;
  breakout: boolean;
  tickAnalysis: boolean;
}

export interface RealTimeScannerSorting {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

