import { inject, Injectable, signal, computed } from '@angular/core';
import {
  RealTimeSignalsService,
  RealTimeSignal,
} from '../real-time-signals/real-time-signals.service';
import { Timeframe, TIMEFRAMES } from '../../models/real-time-scanner-types';
import type { SignalFilter, StrengthFilter } from '../../models/signal-types';

@Injectable({
  providedIn: 'root',
})
export class RealTimeScannerFacadeService {
  private realTimeSignalsService = inject(RealTimeSignalsService);
  private refreshInterval?: ReturnType<typeof setInterval>;

  public isScanning = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  public lastScanTime = signal<Date | null>(null);
  public realTimeSignals = signal<RealTimeSignal[]>([]);
  public alertSignals = signal<RealTimeSignal[]>([]);

  public scanInterval = signal<number>(60);
  public signalThreshold = signal<number>(70);
  public maxSignals = signal<number>(20);
  public selectedTimeframes = signal<Timeframe[]>([
    TIMEFRAMES.TF1M,
    TIMEFRAMES.TF5M,
    TIMEFRAMES.TF15M,
    TIMEFRAMES.TF1H,
    TIMEFRAMES.TF4H,
  ]);
  public adaptiveThresholds = signal<boolean>(true);
  public tickAnalysisEnabled = signal<boolean>(true);

  public filterBySignalType = signal<SignalFilter>('all' as SignalFilter);
  public filterByStrength = signal<StrengthFilter>('all' as StrengthFilter);
  public filterByVolumeSpike = signal<boolean>(true);
  public filterByBreakout = signal<boolean>(true);
  public filterByTickAnalysis = signal<boolean>(true);

  public sortBy = signal<string>('confidence');
  public sortOrder = signal<'asc' | 'desc'>('desc');
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
          this.realTimeSignals.set([]);
          this.isLoading.set(false);
        },
      });
    } catch (error) {
      console.error('Error during real-time scan:', error);
      this.realTimeSignals.set([]);
      this.isLoading.set(false);
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

  setSorting(field: string): void {
    if (this.sortBy() === field) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortOrder.set('desc');
    }
  }

  clearAlerts(): void {
    this.alertSignals.set([]);
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

  private sortSignals(signals: RealTimeSignal[]): RealTimeSignal[] {
    const sortBy = this.sortBy();
    const sortOrder = this.sortOrder();

    return [...signals].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

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

      const result = (aValue as number) - (bValue as number);
      return sortOrder === 'asc' ? result : -result;
    });
  }
}
