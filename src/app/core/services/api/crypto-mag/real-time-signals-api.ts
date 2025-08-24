import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RealTimeSignalsResponse } from '../../../models/api/real-time-signals-api';
import { environment } from '../../../../../environments/environment';

export interface RealTimeSignalsQuery {
  timeframes?: string[];
  threshold?: number;
  limit?: number;
  adaptiveThresholds?: boolean;
  tickAnalysis?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RealTimeSignalsApi {
  private http = inject(HttpClient);
  private readonly url = '/api/real-time-signals';

  getRealTimeSignals(query: RealTimeSignalsQuery = {}): Observable<RealTimeSignalsResponse> {
    const params: any = {};
    if (query.timeframes) params['timeframes'] = query.timeframes;
    if (query.threshold !== undefined) params['threshold'] = query.threshold;
    if (query.limit !== undefined) params['limit'] = query.limit;
    if (query.adaptiveThresholds !== undefined)
      params['adaptiveThresholds'] = query.adaptiveThresholds;
    if (query.tickAnalysis !== undefined) params['tickAnalysis'] = query.tickAnalysis;
    return this.http.get<RealTimeSignalsResponse>(`${environment.apiBaseUrl}${this.url}`, {
      params,
    });
  }
}
