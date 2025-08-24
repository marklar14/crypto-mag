import { Component, inject, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenerStore } from '../../core/store/screener.store';
import { ScreenerService } from '../../core/services/screener/screener';
import {
  RealTimeSignalsService,
  RealTimeSignal,
} from '../../core/services/real-time-signals/real-time-signals.service';
import { TimeframeDataMap } from '../../core/models/api/real-time-signals-api';
import { SkeletonGridRows } from '../skeleton-table-rows/skeleton-table-rows';
import {
  SignalDirection,
  SignalStrength,
  SignalFilter,
  StrengthFilter,
} from '../../core/models/signal-types';

export interface DynamicThresholds {
  priceChange: {
    significant: number;
    strong: number;
    explosive: number;
  };
  volumeSpike: {
    moderate: number;
    high: number;
    extreme: number;
  };
  momentum: {
    acceleration: number;
    reversal: number;
  };
}

export interface TickAnalysis {
  priceMomentum: number;
  volumePressure: number;
  tickFrequency: number;
  largeOrders: number;
}

export const TIMEFRAMES = {
  TF1M: 'tf1m',
  TF5M: 'tf5m',
  TF15M: 'tf15m',
  TF1H: 'tf1h',
  TF4H: 'tf4h',
} as const;

export type Timeframe = (typeof TIMEFRAMES)[keyof typeof TIMEFRAMES];

export function filterSignals(
  signals: any[],
  {
    byType,
    byVolumeSpike,
    byBreakout,
    byTickAnalysis,
    maxSignals,
  }: {
    byType?: string;
    byVolumeSpike?: boolean;
    byBreakout?: boolean;
    byTickAnalysis?: boolean;
    maxSignals?: number;
  },
) {
  let filtered = [...signals];
  if (byType && byType !== 'all') {
    filtered = filtered.filter((s) => s.signalType === byType);
  }
  if (byVolumeSpike) {
    filtered = filtered.filter((s) => s.volumeSpike > 1.5);
  }
  if (byBreakout) {
    filtered = filtered.filter((s) => s.thresholdPercentile > 80);
  }
  if (byTickAnalysis) {
    filtered = filtered.filter((s) => {
      if (s.timeframe === 'tf1m' && s.tickAnalysis) {
        return s.tickAnalysis.volumePressure > 0.2 || s.tickAnalysis.largeOrders > 3;
      }
      return true;
    });
  }
  if (maxSignals) {
    filtered = filtered.slice(0, maxSignals);
  }
  return filtered;
}

@Component({
  selector: 'mag-real-time-scanner',
  imports: [CommonModule],
  templateUrl: './real-time-scanner.html',
  styleUrl: './real-time-scanner.scss',
})
export class RealTimeScanner implements OnInit, OnDestroy {
  readonly TIMEFRAMES = TIMEFRAMES;
  readonly Math = Math;

  private store = inject(ScreenerStore);
  private screener = inject(ScreenerService);
  private realTimeSignalsService = inject(RealTimeSignalsService);
  private refreshInterval?: any;

  public isScanning = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  public lastScanTime = signal<Date | null>(null);
  public scanInterval = signal<number>(60);
  public selectedTimeframes = signal<Timeframe[]>([
    TIMEFRAMES.TF1M,
    TIMEFRAMES.TF5M,
    TIMEFRAMES.TF15M,
    TIMEFRAMES.TF1H,
    TIMEFRAMES.TF4H,
  ]);
  public signalThreshold = signal<number>(70);
  public maxSignals = signal<number>(20);

  public realTimeSignals = signal<RealTimeSignal[]>([]);
  public alertSignals = signal<RealTimeSignal[]>([]);

  public sortBy = signal<string>('confidence');
  public sortOrder = signal<'asc' | 'desc'>('desc');

  public filterBySignalType = signal<SignalFilter>('all');
  public filterByStrength = signal<StrengthFilter>('all');
  public filterByVolumeSpike = signal<boolean>(true);
  public filterByBreakout = signal<boolean>(true);
  public filterByTickAnalysis = signal<boolean>(true);

  public adaptiveThresholds = signal<boolean>(true);
  public tickAnalysisEnabled = signal<boolean>(true);

  public filteredSignals = computed(() => {
    let signals = this.realTimeSignals();

    if (this.filterBySignalType() !== 'all') {
      signals = signals.filter((s) => s.signalType === this.filterBySignalType());
    }

    if (this.filterByStrength() !== 'all') {
      signals = signals.filter((s) => s.signalStrength === this.filterByStrength());
    }

    if (this.filterByVolumeSpike()) {
      signals = signals.filter((s) => s.volumeSpike > 1.5);
    }

    if (this.filterByBreakout()) {
      signals = signals.filter((s) => s.thresholdPercentile > 80);
    }

    if (this.filterByTickAnalysis()) {
      signals = signals.filter((s) => {
        if (s.timeframe === 'tf1m' && s.tickAnalysis) {
          return s.tickAnalysis.volumePressure > 0.2 || s.tickAnalysis.largeOrders > 3;
        }
        return true;
      });
    }

    signals = this.sortSignals(signals);

    return signals.slice(0, this.maxSignals());
  });

  public highConfidenceSignals = computed(() =>
    this.realTimeSignals().filter((s) => s.confidence >= this.signalThreshold()),
  );

  public bullishSignals = computed(() =>
    this.realTimeSignals().filter((s) => s.signalType === 'bullish'),
  );

  public bearishSignals = computed(() =>
    this.realTimeSignals().filter((s) => s.signalType === 'bearish'),
  );

  public tickSignals = computed(() =>
    this.realTimeSignals().filter((s) => s.timeframe === 'tf1m' && s.tickAnalysis),
  );

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stopScanning();
  }

  startScanning(): void {
    if (this.isScanning()) return;
    this.isScanning.set(true);
    this.performScan();
    this.refreshInterval = setInterval(() => {
      if (!this.isScanning()) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = undefined;
        return;
      }
      this.performScan();
    }, this.scanInterval() * 1000);
  }

  stopScanning(): void {
    this.isScanning.set(false);
    this.isLoading.set(false);
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = undefined;
    }
    console.log('Scanning stopped, isScanning:', this.isScanning());
  }

  async performScan(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.lastScanTime.set(new Date());

      const query = {
        timeframes: this.selectedTimeframes(),
        threshold: this.signalThreshold(),
        limit: this.maxSignals(),
        adaptiveThresholds: this.adaptiveThresholds(),
        tickAnalysis: this.tickAnalysisEnabled(),
      };

      this.realTimeSignalsService.getRealTimeSignals(query).subscribe({
        next: (signals: RealTimeSignal[]) => {
          this.realTimeSignals.set(signals);
          this.checkForAlerts(signals);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error fetching real-time signals:', error);
          this.setMockSignals();
          this.isLoading.set(false);
        },
      });
    } catch (error) {
      console.error('Error during real-time scan:', error);
      this.setMockSignals();
      this.isLoading.set(false);
    }
  }

  private setMockSignals(): void {
    const mockSignals: RealTimeSignal[] = [
      {
        symbol: 'BTCUSDT',
        timeframe: 'tf1m',
        signalType: 'bullish',
        signalStrength: 'strong',
        changePercent: 0.8,
        volumeSpike: 3.2,
        thresholdPercentile: 92,
        timeframeData: {
          tf1m: { priceChange: 0.8, volumeChange: 2.1 },
          tf5m: { priceChange: 1.2, volumeChange: 1.8 },
          tf15m: { priceChange: 2.5, volumeChange: 1.5 },
          tf1h: { priceChange: 3.8, volumeChange: 1.2 },
          tf4h: { priceChange: 5.2, volumeChange: 0.9 },
        },
        tickAnalysis: {
          priceMomentum: 0.7,
          volumePressure: 0.6,
          tickFrequency: 8.5,
          largeOrders: 12,
        },
        description: 'Strong buy pressure with large orders, 92nd percentile move',
        timestamp: new Date(),
        confidence: 85,
      },
      {
        symbol: 'ETHUSDT',
        timeframe: 'tf5m',
        signalType: 'bearish',
        signalStrength: 'medium',
        changePercent: -1.2,
        volumeSpike: 2.8,
        thresholdPercentile: 87,
        timeframeData: {
          tf1m: { priceChange: -0.3, volumeChange: 1.8 },
          tf5m: { priceChange: -1.2, volumeChange: 2.8 },
          tf15m: { priceChange: -2.1, volumeChange: 2.2 },
          tf1h: { priceChange: -3.5, volumeChange: 1.9 },
          tf4h: { priceChange: -4.8, volumeChange: 1.6 },
        },
        tickAnalysis: {
          priceMomentum: -0.5,
          volumePressure: -0.4,
          tickFrequency: 6.2,
          largeOrders: 8,
        },
        description: 'Moderate sell pressure, 87th percentile move',
        timestamp: new Date(),
        confidence: 72,
      },
    ];

    this.realTimeSignals.set(mockSignals);
    this.checkForAlerts(mockSignals);
  }

  private checkForAlerts(newSignals: RealTimeSignal[]): void {
    const currentAlerts = this.alertSignals();
    const newAlerts: RealTimeSignal[] = [];

    for (const signal of newSignals) {
      const isNewAlert =
        signal.confidence >= 80 &&
        !currentAlerts.some(
          (alert) =>
            alert.symbol === signal.symbol &&
            alert.timeframe === signal.timeframe &&
            alert.signalType === signal.signalType,
        );

      if (isNewAlert) {
        newAlerts.push(signal);
        this.showNotification(signal);
      }
    }

    if (newAlerts.length > 0) {
      this.alertSignals.set([...newAlerts, ...currentAlerts].slice(0, 50));
    }
  }

  private showNotification(signal: RealTimeSignal): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🚨 ${signal.signalType.toUpperCase()} Signal`, {
        body: `${signal.symbol} - ${signal.description} (${signal.confidence}% confidence)`,
        icon: '/favicon.ico',
      });
    }
  }

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

  toggleTimeframe(timeframe: Timeframe): void {
    const current = this.selectedTimeframes();
    const index = current.indexOf(timeframe);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(timeframe);
    }

    this.selectedTimeframes.set([...current]);
  }

  requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  clearAlerts(): void {
    this.alertSignals.set([]);
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

  private sortSignals(signals: RealTimeSignal[]): RealTimeSignal[] {
    const sortBy = this.sortBy();
    const sortOrder = this.sortOrder();

    return [...signals].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'confidence':
          aValue = a.confidence;
          bValue = b.confidence;
          break;
        case 'volumeSpike':
          aValue = a.volumeSpike;
          bValue = b.volumeSpike;
          break;
        case 'percentile':
          aValue = a.thresholdPercentile;
          bValue = b.thresholdPercentile;
          break;
        case 'priceChange':
          aValue = Math.abs(a.changePercent);
          bValue = Math.abs(b.changePercent);
          break;
        case 'volumePressure':
          aValue = a.tickAnalysis?.volumePressure || 0;
          bValue = b.tickAnalysis?.volumePressure || 0;
          break;
        case 'tickFrequency':
          aValue = a.tickAnalysis?.tickFrequency || 0;
          bValue = b.tickAnalysis?.tickFrequency || 0;
          break;
        case 'largeOrders':
          aValue = a.tickAnalysis?.largeOrders || 0;
          bValue = b.tickAnalysis?.largeOrders || 0;
          break;
        case 'symbol':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        default:
          aValue = a.confidence;
          bValue = b.confidence;
      }

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? result : -result;
      }

      const result = aValue - bValue;
      return sortOrder === 'asc' ? result : -result;
    });
  }

  setSorting(field: string): void {
    if (this.sortBy() === field) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortOrder.set('desc');
    }
  }

  getSortIcon(field: string): string {
    if (this.sortBy() !== field) return '↕️';
    return this.sortOrder() === 'asc' ? '▲' : '▼';
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
