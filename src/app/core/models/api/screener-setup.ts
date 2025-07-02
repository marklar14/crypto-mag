import { SignalDescription } from './screener-result';

export enum ScreenerSetupResponse {
  BullishBreakout = 'BullishBreakout',
  BearishBreakdown = 'BearishBreakdown',
  OversoldBounce = 'OversoldBounce',
  OverboughtShort = 'OverboughtShort',
  LowVolatilitySqueeze = 'LowVolatilitySqueeze',
  TrendReversalLong = 'TrendReversalLong',
  TrendReversalShort = 'TrendReversalShort',
  VolumeSpike = 'VolumeSpike',
  RsiDivergence = 'RsiDivergence',
  BreakOfStructure = 'BreakOfStructure',
}

export interface ScreenerSetup {
  type: ScreenerSetupResponse;
  description: SignalDescription;
}
