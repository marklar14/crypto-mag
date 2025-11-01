import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenerFacadeService } from '../../core/services/screener/screener-facade.service';
import { ScreenerUiService } from '../../core/services/screener/screener-ui.service';
import { SkeletonGridRows } from '../skeleton-table-rows/skeleton-table-rows';
import { Pagination } from '../pagination/pagination';
import { ScreenerSetup } from '../../core/models/api/screener-setup';

@Component({
  selector: 'mag-screener',
  imports: [CommonModule, SkeletonGridRows, Pagination],
  templateUrl: './screener.html',
  styleUrl: './screener.scss',
})
export class Screener implements OnDestroy {
  readonly Array = Array;

  private facade = inject(ScreenerFacadeService);
  public ui = inject(ScreenerUiService);

  public loading = this.facade.loading;
  public screenResults = this.facade.screenResults;
  public pagination = this.facade.pagination;
  public selectedTimeframe = this.facade.selectedTimeframe;
  public currentPage = this.facade.currentPage;
  public itemsPerPage = this.facade.itemsPerPage;
  public autoRefreshEnabled = this.facade.autoRefreshEnabled;
  public autoRefreshInterval = this.facade.autoRefreshInterval;
  public filterText = this.facade.filterText;
  public selectedSignalType = this.facade.selectedSignalType;
  public selectedMarketCap = this.facade.selectedMarketCap;
  public sortBy = this.facade.sortBy;
  public sortOrder = this.facade.sortOrder;
  public expandedDescriptions = this.facade.expandedDescriptions;
  public marketCapRanges = this.facade.marketCapRanges;
  public refreshIntervalOptions = this.facade.refreshIntervalOptions;
  public signalTypes = this.ui.signalTypes;
  public filteredResults = this.facade.filteredResults;

  ngOnInit(): void {
    this.facade.loadScreenerData();
  }

  ngOnDestroy(): void {
    this.facade.destroy();
  }

  setTimeframe(timeframe: string): void {
    this.facade.setTimeframe(timeframe);
  }

  onPageChange(page: number): void {
    this.facade.onPageChange(page);
  }

  onSort(column: string): void {
    this.facade.onSort(column);
  }

  refresh(): void {
    this.facade.refresh();
  }

  toggleDescription(symbol: string): void {
    this.facade.toggleDescription(symbol);
  }

  toggleAutoRefresh(): void {
    this.facade.toggleAutoRefresh();
  }

  updateAutoRefreshInterval(interval: number): void {
    this.facade.updateAutoRefreshInterval(interval);
  }

  getNextRefreshTime(): string {
    return this.facade.getNextRefreshTime();
  }

  get skeletonRows() {
    return Array(6).fill(null);
  }

  getTimeframeLabel(timeframe: string): string {
    return this.ui.getTimeframeLabel(timeframe);
  }

  isBullishSignal(signal: ScreenerSetup | string | null | undefined): boolean {
    return this.ui.isBullishSignal(signal);
  }

  isBearishSignal(signal: ScreenerSetup | string | null | undefined): boolean {
    return this.ui.isBearishSignal(signal);
  }

  isNeutralSignal(signal: ScreenerSetup | string | null | undefined): boolean {
    return this.ui.isNeutralSignal(signal);
  }

  getSignalIcon(signal: ScreenerSetup | string | null | undefined): string {
    return this.ui.getSignalIcon(signal);
  }

  getSignalLabel(signal: ScreenerSetup | string | null | undefined): string {
    return this.ui.getSignalLabel(signal);
  }

  getSignalDescription(signal: ScreenerSetup | string | null | undefined): string {
    return this.ui.getSignalDescription(signal);
  }

  getDescriptionValueKeys(values: Record<string, number | string>): string[] {
    return this.ui.getDescriptionValueKeys(values);
  }
}
