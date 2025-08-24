import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, interval, of, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TickerStore } from '../../store/ticker.store';
import { CryptoMag } from '../crypto/crypto-mag';

@Injectable({ providedIn: 'root' })
export class TickerPollService {
  private readonly tickerStore = inject(TickerStore);
  private readonly api = inject(CryptoMag);
  private readonly destroyRef = inject(DestroyRef);

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
        next: (tickers) => this.tickerStore.setTickers(tickers),
        error: () => this.tickerStore.setLoading(false),
      });
  }
}
