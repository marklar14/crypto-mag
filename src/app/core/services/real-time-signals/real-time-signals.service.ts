import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RealTimeSignalsApi, RealTimeSignalsQuery } from '../api/crypto-mag/real-time-signals-api';
import {
  RealTimeSignalsResponse,
  RealTimeSignalApi,
  TimeframeDataMap,
} from '../../models/api/real-time-signals-api';
import { RealTimeSignalsStore } from '../../store/real-time-signals.store';
import { SignalDirection, SignalStrength } from '../../models/signal-types';

export interface RealTimeSignal {
  symbol: string;
  timeframe: string;
  signalType: SignalDirection;
  signalStrength: SignalStrength;
  changePercent: number;
  volumeSpike: number;
  thresholdPercentile: number;
  timeframeData?: TimeframeDataMap;
  tickAnalysis?: {
    priceMomentum: number;
    volumePressure: number;
    tickFrequency: number;
    largeOrders: number;
  };
  description: string;
  timestamp: Date;
  confidence: number;
}

@Injectable({
  providedIn: 'root',
})
export class RealTimeSignalsService {
  private api = inject(RealTimeSignalsApi);
  private store = inject(RealTimeSignalsStore);

  getRealTimeSignals(query: RealTimeSignalsQuery = {}): Observable<RealTimeSignal[]> {
    return this.api.getRealTimeSignals(query).pipe(
      map((response: RealTimeSignalsResponse) => {
        this.store.setSignals(response.signals, response.metadata);

        return response.signals.map((signal) => this.transformSignal(signal, response.metadata));
      }),
    );
  }

  private transformSignal(apiSignal: RealTimeSignalApi, metadata: any): RealTimeSignal {
    const signalType: SignalDirection = this.mapSignalType(apiSignal.signalType);

    const signalStrength: SignalStrength = this.determineSignalStrength(apiSignal.confidence);

    const thresholdPercentile = this.calculateThresholdPercentile(apiSignal, metadata);

    const description = this.generateDescription(apiSignal, signalType, signalStrength);

    const tickAnalysis = apiSignal.tickAnalysis
      ? {
          priceMomentum: apiSignal.tickAnalysis.priceVelocity,
          volumePressure: apiSignal.tickAnalysis.volumePressure,
          tickFrequency: apiSignal.tickAnalysis.tickFrequency,
          largeOrders: Math.floor(apiSignal.tickAnalysis.volumePressure * 10),
        }
      : undefined;

    const timeframePriceChange = this.getTimeframePriceChange(apiSignal);

    return {
      symbol: apiSignal.symbol,
      timeframe: apiSignal.timeframe,
      signalType,
      signalStrength,
      changePercent: timeframePriceChange,
      volumeSpike: apiSignal.metrics.volumeSpike,
      thresholdPercentile,
      timeframeData: apiSignal.timeframeData,
      tickAnalysis,
      description,
      timestamp: new Date(apiSignal.timestamp),
      confidence: apiSignal.confidence,
    };
  }

  private mapSignalType(apiSignalType: string): SignalDirection {
    switch (apiSignalType) {
      case 'pump':
        return 'bullish';
      case 'dump':
        return 'bearish';
      case 'sideways':
        return 'neutral';
      default:
        return 'neutral';
    }
  }

  private determineSignalStrength(confidence: number): SignalStrength {
    if (confidence >= 85) return 'strong';
    if (confidence >= 70) return 'medium';
    return 'weak';
  }

  private calculateThresholdPercentile(signal: RealTimeSignalApi, metadata: any): number {
    const priceChangePercentile = this.calculatePercentile(
      signal.metrics.priceChange,
      metadata?.thresholds?.[signal.timeframe]?.priceChange,
    );

    const volumeSpikePercentile = this.calculatePercentile(
      signal.metrics.volumeSpike,
      metadata?.thresholds?.[signal.timeframe]?.volumeSpike,
    );

    return Math.round((priceChangePercentile + volumeSpikePercentile) / 2);
  }

  private calculatePercentile(value: number, thresholds: any): number {
    if (!thresholds) return 75;

    const { moderate, significant, strong, explosive } = thresholds;

    if (value >= explosive) return 95;
    if (value >= strong) return 90;
    if (value >= significant) return 85;
    if (value >= moderate) return 75;

    return Math.max(50, Math.round((value / moderate) * 75));
  }

  private getTimeframePriceChange(apiSignal: RealTimeSignalApi): number {
    if (apiSignal.timeframeData) {
      const timeframeKey = apiSignal.timeframe as keyof TimeframeDataMap;
      const timeframeData = apiSignal.timeframeData[timeframeKey];
      if (timeframeData?.priceChange !== undefined) {
        return timeframeData.priceChange;
      }
    }

    return apiSignal.priceChange;
  }

  private generateDescription(
    signal: RealTimeSignalApi,
    signalType: SignalDirection,
    strength: SignalStrength,
  ): string {
    const direction =
      signalType === 'bullish' ? 'upward' : signalType === 'bearish' ? 'downward' : 'sideways';
    const strengthText =
      strength === 'strong' ? 'strong' : strength === 'medium' ? 'moderate' : 'weak';

    let description = `${strengthText} ${direction} momentum`;

    if (signal.metrics.volumeSpike > 2) {
      description += ` with high volume spike (${signal.metrics.volumeSpike.toFixed(1)}x)`;
    }

    if (signal.metrics.momentum > 0.7) {
      description += `, accelerating trend`;
    }

    if (signal.tickAnalysis?.volumePressure && signal.tickAnalysis.volumePressure > 0.6) {
      description += `, strong buy pressure`;
    } else if (signal.tickAnalysis?.volumePressure && signal.tickAnalysis.volumePressure < -0.6) {
      description += `, strong sell pressure`;
    }

    return description;
  }

  getCurrentSignals(): RealTimeSignalApi[] {
    return this.store.signals();
  }

  getMetadata(): any {
    return this.store.metadata();
  }

  isLoading(): boolean {
    return this.store.isLoading();
  }
}
