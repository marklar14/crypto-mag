import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TickerStore } from '../../core/store/ticker.store';
import { TickerCardSkeleton } from '../ticker-card-skeleton/ticker-card-skeleton';

@Component({
  selector: 'mag-ticker-panel',
  imports: [CommonModule, TickerCardSkeleton],
  templateUrl: './ticker-panel.html',
  styleUrl: './ticker-panel.scss',
})
export class TickerPanel {
  private store = inject(TickerStore);
  tickers = this.store.tickers;
  isLoading = this.store.isLoading;
  tickerList = computed(() => this.tickers());
  count = computed(() => this.tickers().length);
}
