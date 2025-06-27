import { Injectable, inject, DestroyRef, effect } from '@angular/core';
import { interval, switchMap, Subscription, tap, catchError, of } from 'rxjs';
import { CryptoMag } from '../crypto/crypto-mag';
import { TickerStore } from '../../store/ticker.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TickerPollService {
  private readonly tickerStore = inject(TickerStore);
  private readonly api = inject(CryptoMag);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.startPolling();
  }

  startPolling() {
    interval(5000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.api.getTickers(environment.defaultSymbols)),
        catchError((err) => {
          console.error('❌ getTickers failed', err);
          return of([]);
        }),
      )
      .subscribe({
        next: (tickers) =>
          this.tickerStore.setTickers(tickers),
        error: () => this.tickerStore.setLoading(false),
      });
  }
}
