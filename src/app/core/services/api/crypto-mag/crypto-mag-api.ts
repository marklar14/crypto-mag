import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TickerApi } from '../../../models/api/ticker-api';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoMagApi {
  private http = inject(HttpClient);
  private readonly url = '/api/bybit/tickers';

  getTickers(symbols?: string[]): Observable<TickerApi[]> {
    const options = symbols ? { params: { symbols } } : {};
    return this.http.get<TickerApi[]>(`${environment.apiBaseUrl}${this.url}`, options);
  }
}
