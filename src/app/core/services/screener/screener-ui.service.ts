import { Injectable } from '@angular/core';
import { ScreenerSetupResponse, ScreenerSetup } from '../../models/api/screener-setup';

@Injectable({
  providedIn: 'root',
})
export class ScreenerUiService {
  readonly signalTypes = Object.values(ScreenerSetupResponse);

  getTimeframeLabel(timeframe: string): string {
    switch (timeframe) {
      case 'tf5m':
        return '5m';
      case 'tf15m':
        return '15m';
      case 'tf1h':
        return '1h';
      case 'tf1d':
        return '1d';
      default:
        return '1h';
    }
  }

  isBullishSignal(signal: ScreenerSetup | string | null | undefined): boolean {
    const signalType = this.getSignalType(signal);
    if (!signalType) return false;
    const bullishSignals = [
      'BullishBreakout',
      'OversoldBounce',
      'TrendReversalLong',
      'BreakOfStructure',
    ];
    return bullishSignals.includes(signalType);
  }

  isBearishSignal(signal: ScreenerSetup | string | null | undefined): boolean {
    const signalType = this.getSignalType(signal);
    if (!signalType) return false;
    const bearishSignals = ['BearishBreakdown', 'OverboughtShort', 'TrendReversalShort'];
    return bearishSignals.includes(signalType);
  }

  isNeutralSignal(signal: ScreenerSetup | string | null | undefined): boolean {
    const signalType = this.getSignalType(signal);
    if (!signalType) return false;
    const neutralSignals = ['LowVolatilitySqueeze', 'VolumeSpike', 'RsiDivergence'];
    return neutralSignals.includes(signalType);
  }

  getSignalIcon(signal: ScreenerSetup | string | null | undefined): string {
    if (this.isBullishSignal(signal)) return '🚀';
    if (this.isBearishSignal(signal)) return '📉';
    if (this.isNeutralSignal(signal)) return '⚡';
    return '❓';
  }

  getSignalLabel(signal: ScreenerSetup | string | null | undefined): string {
    const signalType = this.getSignalType(signal);
    if (!signalType) return '';
    switch (signalType) {
      case 'BullishBreakout':
        return 'Bullish';
      case 'BearishBreakdown':
        return 'Bearish';
      case 'OversoldBounce':
        return 'Bounce';
      case 'OverboughtShort':
        return 'Short';
      case 'LowVolatilitySqueeze':
        return 'Squeeze';
      case 'TrendReversalLong':
        return 'Reversal+';
      case 'TrendReversalShort':
        return 'Reversal-';
      case 'VolumeSpike':
        return 'Volume';
      case 'RsiDivergence':
        return 'Divergence';
      case 'BreakOfStructure':
        return 'Break';
      default:
        return signalType;
    }
  }

  getSignalDescription(signal: ScreenerSetup | string | null | undefined): string {
    const signalType = this.getSignalType(signal);
    if (!signalType) return '';
    switch (signalType) {
      case 'BullishBreakout':
        return 'Price breaks above resistance, potential upward trend.';
      case 'BearishBreakdown':
        return 'Price falls below support, potential downward trend.';
      case 'OversoldBounce':
        return 'Asset is oversold, possible short-term upward bounce.';
      case 'OverboughtShort':
        return 'Asset is overbought, possible short-term pullback.';
      case 'LowVolatilitySqueeze':
        return 'Low volatility, potential for a strong move soon.';
      case 'TrendReversalLong':
        return 'Possible reversal to an uptrend.';
      case 'TrendReversalShort':
        return 'Possible reversal to a downtrend.';
      case 'VolumeSpike':
        return 'Unusually high trading volume detected.';
      case 'RsiDivergence':
        return 'RSI divergence, possible trend change.';
      case 'BreakOfStructure':
        return 'Key support/resistance level broken.';
      default:
        return '';
    }
  }

  getDescriptionValueKeys(values: Record<string, number | string>): string[] {
    return Object.keys(values);
  }

  private getSignalType(signal: ScreenerSetup | string | null | undefined): string | null {
    if (!signal) return null;
    if (typeof signal === 'string') return signal;
    if (signal && typeof signal === 'object' && 'type' in signal) {
      return signal.type as string;
    }
    return null;
  }
}

