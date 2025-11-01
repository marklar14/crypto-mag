import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealTimeScannerFacadeService } from '../../core/services/real-time-scanner/real-time-scanner-facade.service';
import { RealTimeScannerUiService } from '../../core/services/real-time-scanner/real-time-scanner-ui.service';
import { RealTimeSignal } from '../../core/services/real-time-signals/real-time-signals.service';
import { SignalDirection } from '../../core/models/signal-types';
import { Timeframe, TIMEFRAMES } from '../../core/models/real-time-scanner-types';

@Component({
  selector: 'mag-real-time-scanner',
  imports: [CommonModule],
  templateUrl: './real-time-scanner.html',
  styleUrl: './real-time-scanner.scss',
})
export class RealTimeScanner implements OnDestroy {
  readonly TIMEFRAMES = TIMEFRAMES;
  readonly Math = Math;

  private facade = inject(RealTimeScannerFacadeService);
  public ui = inject(RealTimeScannerUiService);

  public isScanning = this.facade.isScanning;
  public isLoading = this.facade.isLoading;
  public lastScanTime = this.facade.lastScanTime;
  public scanInterval = this.facade.scanInterval;
  public signalThreshold = this.facade.signalThreshold;
  public maxSignals = this.facade.maxSignals;
  public selectedTimeframes = this.facade.selectedTimeframes;
  public adaptiveThresholds = this.facade.adaptiveThresholds;
  public tickAnalysisEnabled = this.facade.tickAnalysisEnabled;
  public filterBySignalType = this.facade.filterBySignalType;
  public filterByStrength = this.facade.filterByStrength;
  public filterByVolumeSpike = this.facade.filterByVolumeSpike;
  public filterByBreakout = this.facade.filterByBreakout;
  public filterByTickAnalysis = this.facade.filterByTickAnalysis;
  public sortBy = this.facade.sortBy;
  public sortOrder = this.facade.sortOrder;
  public realTimeSignals = this.facade.realTimeSignals;
  public filteredSignals = this.facade.filteredSignals;
  public highConfidenceSignals = this.facade.highConfidenceSignals;
  public bullishSignals = this.facade.bullishSignals;
  public bearishSignals = this.facade.bearishSignals;
  public tickSignals = this.facade.tickSignals;
  public alertSignals = this.facade.alertSignals;

  ngOnDestroy(): void {
    this.facade.stopScanning();
  }

  startScanning(): void {
    this.facade.startScanning();
  }

  stopScanning(): void {
    this.facade.stopScanning();
  }

  toggleTimeframe(timeframe: Timeframe): void {
    this.facade.toggleTimeframe(timeframe);
  }

  setSorting(field: string): void {
    this.facade.setSorting(field);
  }

  clearAlerts(): void {
    this.facade.clearAlerts();
  }

  requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  getTimeframeLabel(timeframe: string): string {
    return this.ui.getTimeframeLabel(timeframe);
  }

  getSignalIcon(signal: RealTimeSignal): string {
    return this.ui.getSignalIcon(signal);
  }

  getConfidenceColor(confidence: number): string {
    return this.ui.getConfidenceColor(confidence);
  }

  getSignalTypeColor(signalType: SignalDirection): string {
    return this.ui.getSignalTypeColor(signalType);
  }

  getPercentileColor(percentile: number): string {
    return this.ui.getPercentileColor(percentile);
  }

  getVolumePressureColor(pressure: number): string {
    return this.ui.getVolumePressureColor(pressure);
  }

  getVolumePressureIcon(pressure: number): string {
    return this.ui.getVolumePressureIcon(pressure);
  }

  getSignalCardClass(signalType: SignalDirection): string {
    return this.ui.getSignalCardClass(signalType);
  }

  getTradingViewUrl(symbol: string): string {
    return this.ui.getTradingViewUrl(symbol);
  }

  formatPercentile(percentile: number): string {
    return this.ui.formatPercentile(percentile);
  }

  formatTickFrequency(frequency: number): string {
    return this.ui.formatTickFrequency(frequency);
  }

  getTimeframePriceChange(signal: RealTimeSignal, timeframe: Timeframe): number | null {
    return this.ui.getTimeframePriceChange(signal, timeframe);
  }

  formatTimeframeChange(signal: RealTimeSignal, timeframe: Timeframe): string {
    return this.ui.formatTimeframeChange(signal, timeframe);
  }

  getTimeframeChangeColor(signal: RealTimeSignal, timeframe: Timeframe): string {
    return this.ui.getTimeframeChangeColor(signal, timeframe);
  }

  getSortIcon(field: string): string {
    return this.ui.getSortIcon(field, this.sortBy(), this.sortOrder());
  }

  getSortLabel(field: string): string {
    return this.ui.getSortLabel(field);
  }
}
