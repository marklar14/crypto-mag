export interface TimeframeData {
  priceChange: number;
  volumeChange: number;
}

export interface TimeframeDataMap {
  tf1m?: TimeframeData;
  tf5m?: TimeframeData;
  tf15m?: TimeframeData;
  tf1h?: TimeframeData;
  tf4h?: TimeframeData;
}

export interface RealTimeSignalApi {
  symbol: string;
  timeframe: string;
  signalType: 'pump' | 'dump' | 'sideways';
  confidence: number;
  priceChange: number;
  volumeChange: number;
  metrics: {
    priceChange: number;
    volumeSpike: number;
    momentum: number;
    volatility: number;
  };
  timeframeData?: TimeframeDataMap;
  tickAnalysis?: {
    volumePressure: number;
    tickFrequency: number;
    priceVelocity: number;
  };
  timestamp: string;
}

export interface RealTimeSignalsMetadata {
  scanTime: number;
  totalInstruments: number;
  signalsFound: number;
  thresholds: Record<
    string,
    {
      priceChange: {
        moderate: number;
        significant: number;
        strong: number;
        explosive: number;
      };
      volumeSpike: {
        moderate: number;
        high: number;
        extreme: number;
      };
    }
  >;
}

export interface RealTimeSignalsResponse {
  signals: RealTimeSignalApi[];
  metadata: RealTimeSignalsMetadata;
}

export enum TimeframeEnum {
  ONE_MINUTE = '1m',
  FIVE_MINUTES = '5m',
  FIFTEEN_MINUTES = '15m',
  ONE_HOUR = '1h',
  FOUR_HOURS = '4h',
}
