import { CommonModule } from '@angular/common';
import { Component, computed, inject, effect, OnDestroy } from '@angular/core';
import { TickerStore } from '../../core/store/ticker.store';
import { TickerCardSkeleton } from '../ticker-card-skeleton/ticker-card-skeleton';

@Component({
  selector: 'mag-ticker-panel',
  imports: [CommonModule, TickerCardSkeleton],
  templateUrl: './ticker-panel.html',
  styleUrl: './ticker-panel.scss',
})
export class TickerPanel implements OnDestroy {
  private store = inject(TickerStore);
  tickers = this.store.tickers;
  isLoading = this.store.isLoading;
  tickerList = computed(() => this.tickers());
  count = computed(() => this.tickers().length);
  
  private loadingTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      if (this.isLoading()) {
        // Zrušit předchozí timeout pokud existuje
        if (this.loadingTimeout) {
          clearTimeout(this.loadingTimeout);
        }
        
        // Spustit nový timeout
        this.loadingTimeout = setTimeout(() => {
          if (this.isLoading() && this.tickerList().length === 0) {
            this.store.setLoading(false);
          }
        }, 10000); // 10 sekund
      } else {
        // Když loading skončí, zrušit timeout
        if (this.loadingTimeout) {
          clearTimeout(this.loadingTimeout);
          this.loadingTimeout = undefined;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }
}
