import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RealTimeSignalsService } from './real-time-signals.service';
import { RealTimeSignalsApi } from '../api/crypto-mag/real-time-signals-api';
import { RealTimeSignalsResponse, RealTimeSignalApi } from '../../models/api/real-time-signals-api';

describe('RealTimeSignalsService', () => {
  let service: RealTimeSignalsService;
  let httpMock: HttpTestingController;
  let api: RealTimeSignalsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RealTimeSignalsService, RealTimeSignalsApi],
    });

    service = TestBed.inject(RealTimeSignalsService);
    httpMock = TestBed.inject(HttpTestingController);
    api = TestBed.inject(RealTimeSignalsApi);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform API signals to component format', (done) => {
    const mockApiResponse: RealTimeSignalsResponse = {
      signals: [
        {
          symbol: 'BTCUSDT',
          timeframe: 'tf1s',
          signalType: 'pump',
          confidence: 85,
          priceChange: 2.5,
          volumeChange: 150,
          metrics: {
            priceChange: 2.5,
            volumeSpike: 3.2,
            momentum: 0.8,
            volatility: 0.15,
          },
          tickAnalysis: {
            volumePressure: 0.7,
            tickFrequency: 10.5,
            priceVelocity: 0.8,
          },
          timestamp: '2024-01-01T12:00:00Z',
        },
      ],
      metadata: {
        scanTime: 1000,
        totalInstruments: 100,
        signalsFound: 1,
        thresholds: {
          tf1s: {
            priceChange: {
              moderate: 1.0,
              significant: 2.0,
              strong: 3.0,
              explosive: 5.0,
            },
            volumeSpike: {
              moderate: 1.5,
              high: 2.5,
              extreme: 4.0,
            },
          },
        },
      },
    };

    service.getRealTimeSignals().subscribe((signals) => {
      expect(signals.length).toBe(1);
      const signal = signals[0];

      expect(signal.symbol).toBe('BTCUSDT');
      expect(signal.timeframe).toBe('tf1s');
      expect(signal.signalType).toBe('bullish');
      expect(signal.signalStrength).toBe('strong');
      expect(signal.confidence).toBe(85);
      expect(signal.changePercent).toBe(2.5);
      expect(signal.volumeSpike).toBe(3.2);
      expect(signal.tickAnalysis).toBeDefined();
      expect(signal.tickAnalysis?.volumePressure).toBe(0.7);
      expect(signal.tickAnalysis?.tickFrequency).toBe(10.5);
      expect(signal.description).toContain('strong upward momentum');

      done();
    });

    const req = httpMock.expectOne('http://localhost:3000/api/real-time-signals');
    expect(req.request.method).toBe('GET');
    req.flush(mockApiResponse);
  });

  it('should handle API errors gracefully', (done) => {
    service.getRealTimeSignals().subscribe({
      next: () => fail('Should not succeed'),
      error: (error) => {
        expect(error.status).toBe(500);
        done();
      },
    });

    const req = httpMock.expectOne('http://localhost:3000/api/real-time-signals');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should map signal types correctly', () => {
    const testCases = [
      { apiType: 'pump', expected: 'bullish' },
      { apiType: 'dump', expected: 'bearish' },
      { apiType: 'sideways', expected: 'neutral' },
      { apiType: 'unknown', expected: 'neutral' },
    ];

    // We can't directly test private methods, but we can test the transformation
    // by calling the public method and checking the result
    const mockResponse: RealTimeSignalsResponse = {
      signals: testCases.map((tc) => ({
        symbol: 'TEST',
        timeframe: 'tf1m',
        signalType: tc.apiType as any,
        confidence: 70,
        priceChange: 1.0,
        volumeChange: 100,
        metrics: {
          priceChange: 1.0,
          volumeSpike: 1.5,
          momentum: 0.5,
          volatility: 0.1,
        },
        timestamp: '2024-01-01T12:00:00Z',
      })),
      metadata: {
        scanTime: 1000,
        totalInstruments: 100,
        signalsFound: testCases.length,
        thresholds: {},
      },
    };

    service.getRealTimeSignals().subscribe((signals) => {
      testCases.forEach((testCase, index) => {
        expect(signals[index].signalType).toBe(testCase.expected);
      });
    });

    const req = httpMock.expectOne('http://localhost:3000/api/real-time-signals');
    req.flush(mockResponse);
  });

  it('should determine signal strength based on confidence', () => {
    const testCases = [
      { confidence: 90, expected: 'strong' },
      { confidence: 85, expected: 'strong' },
      { confidence: 75, expected: 'medium' },
      { confidence: 70, expected: 'medium' },
      { confidence: 50, expected: 'weak' },
    ];

    const mockResponse: RealTimeSignalsResponse = {
      signals: testCases.map((tc) => ({
        symbol: 'TEST',
        timeframe: 'tf1m',
        signalType: 'pump',
        confidence: tc.confidence,
        priceChange: 1.0,
        volumeChange: 100,
        metrics: {
          priceChange: 1.0,
          volumeSpike: 1.5,
          momentum: 0.5,
          volatility: 0.1,
        },
        timestamp: '2024-01-01T12:00:00Z',
      })),
      metadata: {
        scanTime: 1000,
        totalInstruments: 100,
        signalsFound: testCases.length,
        thresholds: {},
      },
    };

    service.getRealTimeSignals().subscribe((signals) => {
      testCases.forEach((testCase, index) => {
        expect(signals[index].signalStrength).toBe(testCase.expected);
      });
    });

    const req = httpMock.expectOne('http://localhost:3000/api/real-time-signals');
    req.flush(mockResponse);
  });
});
