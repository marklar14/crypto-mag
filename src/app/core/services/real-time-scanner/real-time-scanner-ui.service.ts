import { Injectable } from '@angular/core';
import { RealTimeSignal } from '../real-time-signals/real-time-signals.service';
import { SignalDirection } from '../../models/signal-types';
import { Timeframe, TIMEFRAMES } from '../../models/real-time-scanner-types';
import { TimeframeDataMap } from '../../models/api/real-time-signals-api';

@Injectable({
  providedIn: 'root',
})
export class RealTimeScannerUiService {
  readonly TIMEFRAMES = TIMEFRAMES;
  readonly Math = Math;

  getTimeframeLabel(timeframe: string): string {
    const labels: Record<string, string> = {
      tf1m: '1m',
      tf5m: '5m',
      tf15m: '15m',
      tf1h: '1h',
      tf4h: '4h',
    };
    return labels[timeframe] || timeframe;
  }

  getSignalIcon(signal: RealTimeSignal): string {
    if (signal.signalType === 'bullish') return '🚀';
    if (signal.signalType === 'bearish') return '📉';
    return '➡️';
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 80) return 'text-green-500';
    if (confidence >= 60) return 'text-yellow-500';
    return 'text-red-500';
  }

  getSignalTypeColor(signalType: SignalDirection): string {
    if (signalType === 'bullish') return 'text-green-500';
    if (signalType === 'bearish') return 'text-red-500';
    return 'text-gray-500';
  }

  getPercentileColor(percentile: number): string {
    if (percentile >= 95) return 'text-red-500 font-bold';
    if (percentile >= 90) return 'text-orange-500 font-semibold';
    if (percentile >= 80) return 'text-yellow-500';
    return 'text-gray-500';
  }

  getVolumePressureColor(pressure: number): string {
    if (pressure > 0.5) return 'text-green-500';
    if (pressure < -0.5) return 'text-red-500';
    return 'text-gray-500';
  }

  getVolumePressureIcon(pressure: number): string {
    if (pressure > 0.5) return '📈';
    if (pressure < -0.5) return '📉';
    return '➡️';
  }

  getSignalCardClass(signalType: SignalDirection): string {
    switch (signalType) {
      case 'bullish':
        return 'bg-green-950 border-green-700 text-green-100';
      case 'bearish':
        return 'bg-red-950 border-red-700 text-red-100';
      default:
        return 'bg-skin-panel text-skin-text';
    }
  }

  getTradingViewUrl(symbol: string): string {
    return `https://www.tradingview.com/chart/?symbol=BINANCE:${symbol}`;
  }

  formatPercentile(percentile: number): string {
    return `${percentile}th`;
  }

  formatTickFrequency(frequency: number): string {
    return `${frequency.toFixed(1)}/s`;
  }

  getTimeframePriceChange(signal: RealTimeSignal, timeframe: Timeframe): number | null {
    if (!signal.timeframeData) return null;

    const timeframeKey = timeframe as keyof TimeframeDataMap;
    const data = signal.timeframeData[timeframeKey];
    return data?.priceChange || null;
  }

  formatTimeframeChange(signal: RealTimeSignal, timeframe: Timeframe): string {
    const change = this.getTimeframePriceChange(signal, timeframe);
    if (change === null) return '-';

    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }

  getTimeframeChangeColor(signal: RealTimeSignal, timeframe: Timeframe): string {
    const change = this.getTimeframePriceChange(signal, timeframe);
    if (change === null) return 'text-skin-muted';
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-skin-muted';
  }

  getSortIcon(sortBy: string, currentSortBy: string, sortOrder: 'asc' | 'desc'): string {
    if (currentSortBy !== sortBy) return '↕️';
    return sortOrder === 'asc' ? '▲' : '▼';
  }

  getSortLabel(field: string): string {
    const labels: Record<string, string> = {
      confidence: 'Confidence',
      volumeSpike: 'Volume Spike',
      percentile: 'Percentile',
      priceChange: 'Price Change',
      volumePressure: 'Volume Pressure',
      tickFrequency: 'Tick Frequency',
      largeOrders: 'Large Orders',
      symbol: 'Symbol',
    };
    return labels[field] || field;
  }
}
