import { inject, Injectable } from '@angular/core';
import { ScreenerApi, ScreenerParams } from '../api/screener-api/screener-api';
import { Observable } from 'rxjs';
import { PaginatedScreenerResponse } from '../../models/api/paginated-screener-response';

@Injectable({
  providedIn: 'root',
})
export class ScreenerService {
  private api = inject(ScreenerApi);

  getScreener(params?: ScreenerParams): Observable<PaginatedScreenerResponse> {
    return this.api.getScreener(params);
  }

  clearCache(): Observable<any> {
    return this.api.clearCache();
  }
}
