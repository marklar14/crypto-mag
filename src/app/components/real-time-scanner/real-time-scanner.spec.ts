import { filterSignals } from './real-time-scanner';

describe('filterSignals', () => {
  const mockSignals = [
    {
      symbol: 'A',
      timeframe: 'tf1m',
      signalType: 'bullish',
      volumeSpike: 2.0,
      thresholdPercentile: 85,
      tickAnalysis: { volumePressure: 0.3, largeOrders: 4 },
    },
    {
      symbol: 'B',
      timeframe: 'tf1m',
      signalType: 'bearish',
      volumeSpike: 1.0,
      thresholdPercentile: 75,
      tickAnalysis: { volumePressure: 0.1, largeOrders: 1 },
    },
  ];

  it('filters by volume spike', () => {
    const result = filterSignals(mockSignals, { byVolumeSpike: true });
    expect(result.length).toBe(1);
    expect(result[0].symbol).toBe('A');
  });

  it('filters by breakout (threshold percentile)', () => {
    const result = filterSignals(mockSignals, { byBreakout: true });
    expect(result.length).toBe(1);
    expect(result[0].symbol).toBe('A');
  });

  it('filters by tick analysis', () => {
    const result = filterSignals(mockSignals, { byTickAnalysis: true });
    expect(result.length).toBe(1);
    expect(result[0].symbol).toBe('A');
  });

  it('shows all signals when all filters are off', () => {
    const result = filterSignals(mockSignals, {});
    expect(result.length).toBe(2);
  });

  it('filters out all signals if all filters are on and none match', () => {
    const result = filterSignals(
      [
        {
          symbol: 'C',
          timeframe: 'tf1m',
          signalType: 'bullish',
          volumeSpike: 1.0,
          thresholdPercentile: 75,
          tickAnalysis: { volumePressure: 0.1, largeOrders: 1 },
        },
      ],
      { byVolumeSpike: true, byBreakout: true, byTickAnalysis: true },
    );
    expect(result.length).toBe(0);
  });
});
