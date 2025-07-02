import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedScreenerResponse } from '../../../models/api/paginated-screener-response';
import { environment } from '../../../../../environments/environment';

export interface ScreenerParams {
  page?: number;
  limit?: number;
  timeframe?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class ScreenerApi {
  private http = inject(HttpClient);
  private readonly url = '/screener';

  getScreener(params?: ScreenerParams): Observable<PaginatedScreenerResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.timeframe) httpParams = httpParams.set('timeframe', params.timeframe);
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
      if (params.order) httpParams = httpParams.set('order', params.order);
    }

    return this.http.get<PaginatedScreenerResponse>(`${environment.apiBaseUrl}${this.url}`, {
      params: httpParams,
    });
  }

  clearCache(): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/screener/cache/clear`, {});
  }
}
