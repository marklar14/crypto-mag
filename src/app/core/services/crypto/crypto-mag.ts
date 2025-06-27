import { inject, Injectable } from '@angular/core';
import { CryptoMagApi } from '../api/crypto-mag-api';
import { map, Observable } from 'rxjs';
import { Ticker } from '../../models/ticker';
import { mapTickers } from '../../models/mappers/ticker.mapper';

@Injectable({
  providedIn: 'root'
})
export class CryptoMag {

  private api = inject(CryptoMagApi);

  getTickers(symbols?: string[]): Observable<Ticker[]> {
    return this.api.getTickers(symbols).pipe(map(mapTickers));
  }
}
