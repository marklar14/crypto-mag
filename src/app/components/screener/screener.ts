import { Component, inject, OnInit, computed, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenerStore } from '../../core/store/screener.store';
import { ScreenerService } from '../../core/services/screener/screener';
import { SkeletonGridRows } from '../skeleton-table-rows/skeleton-table-rows';
import { Pagination } from '../pagination/pagination';
import { MultiTimeframeData, ScreenerResultResponse } from '../../core/models/api/screener-result';
import { ScreenerParams } from '../../core/services/api/screener-api/screener-api';
import { ScreenerSetupResponse } from '../../core/models/api/screener-setup';

@Component({
  selector: 'mag-screener',
  imports: [CommonModule, SkeletonGridRows, Pagination],
  templateUrl: './screener.html',
  styleUrl: './screener.scss',
})
export class Screener implements OnInit, OnDestroy {
  private store = inject(ScreenerStore);
  private screener = inject(ScreenerService);
  readonly Array = Array;

  loading = this.store.isLoading;
  screenResults = this.store.results;
  pagination = this.store.pagination;

  selectedTimeframe = 'tf1h';
  currentPage = 1;
  itemsPerPage = 20;

  public autoRefreshEnabled = signal<boolean>(false);
  public autoRefreshInterval = signal<number>(60);
  private autoRefreshTimer?: any;

  public sortBy = signal<string>('symbol');
  public sortOrder = signal<'asc' | 'desc'>('asc');
  public filterText = signal<string>('');
  public expandedDescriptions = signal<Record<string, boolean>>({});
  public signalTypes = Object.values(ScreenerSetupResponse);
  public selectedSignalType = signal<string | null>(null);
  public selectedMarketCap = signal<string | null>(null);

  public marketCapRanges = [
    { value: '', label: 'All Market Caps' },
    { value: 'mega', label: 'Mega Cap (>$10B)', min: 10000000000 },
    { value: 'large', label: 'Large Cap ($1B-$10B)', min: 1000000000, max: 9999999999 },
    { value: 'mid', label: 'Mid Cap ($100M-$1B)', min: 100000000, max: 999999999 },
    { value: 'small', label: 'Small Cap ($10M-$100M)', min: 10000000, max: 99999999 },
    { value: 'micro', label: 'Micro Cap (<$10M)', max: 9999999 },
  ];

  public refreshIntervalOptions = [
    { value: 30, label: '30s' },
    { value: 60, label: '1m' },
    { value: 120, label: '2m' },
    { value: 300, label: '5m' },
    { value: 600, label: '10m' },
  ];

  sortResults<T extends { [key: string]: any }>(results: T[]): T[] {
    const sortBy = this.sortBy();
    const sortOrder = this.sortOrder();
    return [...results].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }

  tf5mResults = computed(() =>
    this.sortResults(
      this.screenResults()
        .map((item) => ({
          symbol: item.symbol,
          lastPrice: item.tf5m.lastPrice,
          previousPrice: item.tf5m.previousPrice,
          changePercent: item.tf5m.changePercent,
          volume24h: item.tf5m.volume24h,
          rsi: item.tf5m.rsi,
          macdHist: item.tf5m.macdHist,
          adx: item.tf5m.adx,
          signal: item.tf5m.signal,
          description: item.tf5m.description,
          marketCap: item.tf5m.marketCap,
        }))
        .filter((item) => item.lastPrice !== undefined),
    ),
  );

  tf15mResults = computed(() =>
    this.sortResults(
      this.screenResults()
        .map((item) => ({
          symbol: item.symbol,
          lastPrice: item.tf15m.lastPrice,
          previousPrice: item.tf15m.previousPrice,
          changePercent: item.tf15m.changePercent,
          volume24h: item.tf15m.volume24h,
          rsi: item.tf15m.rsi,
          macdHist: item.tf15m.macdHist,
          adx: item.tf15m.adx,
          signal: item.tf15m.signal,
          description: item.tf15m.description,
          marketCap: item.tf15m.marketCap,
        }))
        .filter((item) => item.lastPrice !== undefined),
    ),
  );

  tf1hResults = computed(() =>
    this.sortResults(
      this.screenResults()
        .map((item) => ({
          symbol: item.symbol,
          lastPrice: item.tf1h.lastPrice,
          previousPrice: item.tf1h.previousPrice,
          changePercent: item.tf1h.changePercent,
          volume24h: item.tf1h.volume24h,
          rsi: item.tf1h.rsi,
          macdHist: item.tf1h.macdHist,
          adx: item.tf1h.adx,
          signal: item.tf1h.signal,
          description: item.tf1h.description,
          marketCap: item.tf1h.marketCap,
        }))
        .filter((item) => item.lastPrice !== undefined),
    ),
  );

  tf1dResults = computed(() =>
    this.sortResults(
      this.screenResults()
        .map((item) => ({
          symbol: item.symbol,
          lastPrice: item.tf1d.lastPrice,
          previousPrice: item.tf1d.previousPrice,
          changePercent: item.tf1d.changePercent,
          volume24h: item.tf1d.volume24h,
          rsi: item.tf1d.rsi,
          macdHist: item.tf1d.macdHist,
          adx: item.tf1d.adx,
          signal: item.tf1d.signal,
          description: item.tf1d.description,
          marketCap: item.tf1d.marketCap,
        }))
        .filter((item) => item.lastPrice !== undefined),
    ),
  );

  get currentResults() {
    switch (this.selectedTimeframe) {
      case 'tf5m':
        return this.tf5mResults();
      case 'tf15m':
        return this.tf15mResults();
      case 'tf1h':
        return this.tf1hResults();
      case 'tf1d':
        return this.tf1dResults();
      default:
        return this.tf1hResults();
    }
  }

  get skeletonRows() {
    return Array(6).fill(null);
  }

  get filteredResults() {
    const filter = this.filterText().toLowerCase();
    const type = this.selectedSignalType();
    const marketCapFilter = this.selectedMarketCap();
    let results = this.currentResults;

    if (filter) {
      results = results.filter((item) => item.symbol?.toLowerCase().includes(filter));
    }
    if (type) {
      results = results.filter((item) => typeof item.signal === 'string' && item.signal === type);
    }
    if (marketCapFilter) {
      const selectedRange = this.marketCapRanges.find((range) => range.value === marketCapFilter);
      if (selectedRange) {
        results = results.filter((item) => {
          if (!item.marketCap) return false;
          const marketCap = item.marketCap;
          if (selectedRange.min !== undefined && marketCap < selectedRange.min) return false;
          if (selectedRange.max !== undefined && marketCap > selectedRange.max) return false;
          return true;
        });
      }
    }
    return results;
  }

  ngOnInit(): void {
    this.loadScreenerData();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadScreenerData(): void {
    this.store.setLoading(true);
    const params: ScreenerParams = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      timeframe: this.selectedTimeframe,
    };

    this.screener.getScreener(params).subscribe({
      next: (response) => {
        this.store.setData({
          results: response.data,
          pagination: response.pagination,
        });
      },
      error: () => this.store.setLoading(false),
    });
  }

  setTimeframe(timeframe: string): void {
    this.selectedTimeframe = timeframe;
    this.currentPage = 1;
    this.loadScreenerData();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadScreenerData();
  }

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

  isBullishSignal(signal: any): boolean {
    const bullishSignals = [
      'BullishBreakout',
      'OversoldBounce',
      'TrendReversalLong',
      'BreakOfStructure',
    ];
    return bullishSignals.includes(signal);
  }

  isBearishSignal(signal: any): boolean {
    const bearishSignals = ['BearishBreakdown', 'OverboughtShort', 'TrendReversalShort'];
    return bearishSignals.includes(signal);
  }

  isNeutralSignal(signal: any): boolean {
    const neutralSignals = ['LowVolatilitySqueeze', 'VolumeSpike', 'RsiDivergence'];
    return neutralSignals.includes(signal);
  }

  getSignalIcon(signal: any): string {
    if (this.isBullishSignal(signal)) return '🚀';
    if (this.isBearishSignal(signal)) return '📉';
    if (this.isNeutralSignal(signal)) return '⚡';
    return '❓';
  }

  getSignalLabel(signal: any): string {
    switch (signal) {
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
        return signal;
    }
  }

  getSignalDescription(signal: any): string {
    switch (signal) {
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

  public onSort(column: string): void {
    if (this.sortBy() === column) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortOrder.set('asc');
    }
  }

  public refresh(): void {
    this.store.setLoading(true);
    this.screener.clearCache().subscribe({
      next: () => this.loadScreenerData(),
      error: () => this.loadScreenerData(),
    });
  }

  getDescriptionValueKeys(values: Record<string, number | string>): string[] {
    return Object.keys(values);
  }

  toggleDescription(symbol: string): void {
    const current = this.expandedDescriptions();
    this.expandedDescriptions.set({
      ...current,
      [symbol]: !current[symbol],
    });
  }

  private startAutoRefresh(): void {
    if (this.autoRefreshEnabled()) {
      this.stopAutoRefresh();
      this.autoRefreshTimer = setInterval(() => {
        this.loadScreenerData();
      }, this.autoRefreshInterval() * 1000);
    }
  }

  private stopAutoRefresh(): void {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = undefined;
    }
  }

  public toggleAutoRefresh(): void {
    this.autoRefreshEnabled.set(!this.autoRefreshEnabled());
    if (this.autoRefreshEnabled()) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  public updateAutoRefreshInterval(interval: number): void {
    this.autoRefreshInterval.set(interval);
    if (this.autoRefreshEnabled()) {
      this.startAutoRefresh();
    }
  }

  public getNextRefreshTime(): string {
    if (!this.autoRefreshEnabled()) return 'Disabled';

    const now = new Date();
    const nextRefresh = new Date(now.getTime() + this.autoRefreshInterval() * 1000);
    return nextRefresh.toLocaleTimeString();
  }
}
