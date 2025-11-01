import { inject, Injectable, signal, computed } from '@angular/core';
import { ScreenerStore } from '../../store/screener.store';
import { ScreenerService } from './screener';
import { ScreenerParams } from '../api/screener-api/screener-api';
import { ScreenerSetup } from '../../models/api/screener-setup';
import { SignalDescription } from '../../models/api/screener-result';

export interface ScreenerFilters {
  text: string;
  signalType: string | null;
  marketCap: string | null;
}

export interface ScreenerSorting {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ScreenerResultItem {
  symbol: string;
  lastPrice: number | undefined;
  previousPrice: number | undefined;
  changePercent: number | undefined;
  volume24h: number | undefined;
  rsi: number | undefined;
  macdHist: number | undefined;
  adx: number | undefined;
  signal: ScreenerSetup | undefined;
  description: SignalDescription | undefined;
  marketCap: number | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ScreenerFacadeService {
  private store = inject(ScreenerStore);
  private screener = inject(ScreenerService);
  private autoRefreshTimer?: ReturnType<typeof setInterval>;

  public loading = this.store.isLoading;
  public screenResults = this.store.results;
  public pagination = this.store.pagination;

  public selectedTimeframe = signal<string>('tf1h');
  public currentPage = signal<number>(1);
  public itemsPerPage = signal<number>(20);

  public autoRefreshEnabled = signal<boolean>(false);
  public autoRefreshInterval = signal<number>(60);

  public filterText = signal<string>('');
  public selectedSignalType = signal<string | null>(null);
  public selectedMarketCap = signal<string | null>(null);

  public sortBy = signal<string>('symbol');
  public sortOrder = signal<'asc' | 'desc'>('asc');

  public expandedDescriptions = signal<Record<string, boolean>>({});
  public readonly marketCapRanges = [
    { value: '', label: 'All Market Caps' },
    { value: 'mega', label: 'Mega Cap (>$10B)', min: 10000000000 },
    { value: 'large', label: 'Large Cap ($1B-$10B)', min: 1000000000, max: 9999999999 },
    { value: 'mid', label: 'Mid Cap ($100M-$1B)', min: 100000000, max: 999999999 },
    { value: 'small', label: 'Small Cap ($10M-$100M)', min: 10000000, max: 99999999 },
    { value: 'micro', label: 'Micro Cap (<$10M)', max: 9999999 },
  ];

  public readonly refreshIntervalOptions = [
    { value: 30, label: '30s' },
    { value: 60, label: '1m' },
    { value: 120, label: '2m' },
    { value: 300, label: '5m' },
    { value: 600, label: '10m' },
  ];

  private createTimeframeResults(timeframe: 'tf5m' | 'tf15m' | 'tf1h' | 'tf1d') {
    return computed(() =>
      this.sortResults(
        this.screenResults()
          .map(
            (item): ScreenerResultItem => ({
              symbol: item.symbol,
              lastPrice: item[timeframe].lastPrice,
              previousPrice: item[timeframe].previousPrice,
              changePercent: item[timeframe].changePercent,
              volume24h: item[timeframe].volume24h,
              rsi: item[timeframe].rsi,
              macdHist: item[timeframe].macdHist,
              adx: item[timeframe].adx,
              signal: item[timeframe].signal,
              description: item[timeframe].description,
              marketCap: item[timeframe].marketCap,
            }),
          )
          .filter((item) => item.lastPrice !== undefined),
      ),
    );
  }

  public tf5mResults = this.createTimeframeResults('tf5m');
  public tf15mResults = this.createTimeframeResults('tf15m');
  public tf1hResults = this.createTimeframeResults('tf1h');
  public tf1dResults = this.createTimeframeResults('tf1d');

  public currentResults = computed(() => {
    const timeframe = this.selectedTimeframe();
    switch (timeframe) {
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
  });

  public filteredResults = computed(() => {
    const filter = this.filterText().toLowerCase();
    const type = this.selectedSignalType();
    const marketCapFilter = this.selectedMarketCap();
    let results = this.currentResults();

    if (filter) {
      results = results.filter((item) => item.symbol?.toLowerCase().includes(filter));
    }
    if (type) {
      results = results.filter((item) => {
        if (!item.signal) return false;
        return item.signal.type === type || String(item.signal.type) === type;
      });
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
  });

  loadScreenerData(): void {
    this.store.setLoading(true);
    const params: ScreenerParams = {
      page: this.currentPage(),
      limit: this.itemsPerPage(),
      timeframe: this.selectedTimeframe(),
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
    this.selectedTimeframe.set(timeframe);
    this.currentPage.set(1);
    this.loadScreenerData();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadScreenerData();
  }

  onSort(column: string): void {
    if (this.sortBy() === column) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortOrder.set('asc');
    }
  }

  refresh(): void {
    this.store.setLoading(true);
    this.screener.clearCache().subscribe({
      next: () => this.loadScreenerData(),
      error: () => this.loadScreenerData(),
    });
  }

  toggleDescription(symbol: string): void {
    const current = this.expandedDescriptions();
    this.expandedDescriptions.set({
      ...current,
      [symbol]: !current[symbol],
    });
  }

  toggleAutoRefresh(): void {
    this.autoRefreshEnabled.set(!this.autoRefreshEnabled());
    if (this.autoRefreshEnabled()) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  updateAutoRefreshInterval(interval: number): void {
    this.autoRefreshInterval.set(interval);
    if (this.autoRefreshEnabled()) {
      this.startAutoRefresh();
    }
  }

  getNextRefreshTime(): string {
    if (!this.autoRefreshEnabled()) return 'Disabled';

    const now = new Date();
    const nextRefresh = new Date(now.getTime() + this.autoRefreshInterval() * 1000);
    return nextRefresh.toLocaleTimeString();
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

  destroy(): void {
    this.stopAutoRefresh();
  }

  private sortResults(results: ScreenerResultItem[]): ScreenerResultItem[] {
    const sortBy = this.sortBy();
    const sortOrder = this.sortOrder();
    return [...results].sort((a, b) => {
      const aValue = a[sortBy as keyof ScreenerResultItem];
      const bValue = b[sortBy as keyof ScreenerResultItem];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }
}
