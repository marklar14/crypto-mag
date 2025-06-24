import { ProfitTargetCalculator } from './profit-target-calculator';

describe('ProfitTargetCalculator logic', () => {
  let component: ProfitTargetCalculator;

  beforeEach(() => {
    component = new ProfitTargetCalculator();

    // Vstupní data (lze přepsat dle potřeby)
    component.balance = 1000;
    component.riskPercent = 1;
    component.entryPrice = 2.6;
    component.targetPrice = 2.7;
    component.tpSlRatio = 2;
    component.leverage = 10;
  });

  it('should calculate correct risk amount', () => {
    expect(component.riskAmount).toBeCloseTo(10); // 1 % z 1000
  });

  it('should calculate correct TP and SL distances', () => {
    expect(component.tpDistance).toBeCloseTo(0.1);
    expect(component.slDistance).toBeCloseTo(0.05);
  });

  it('should calculate correct stop loss price (long position)', () => {
    expect(component.stopLossPrice).toBeCloseTo(2.55); // entry - slDistance
  });

  it('should calculate correct notional value', () => {
    expect(component.notionalValue).toBeCloseTo(100); // 10 * 10
  });

  it('should calculate correct position size', () => {
    expect(component.positionSize).toBeCloseTo(38.46, 2); // 100 / 2.6
  });

  it('should calculate correct USDT required (margin)', () => {
    expect(component.usdtRequired).toBeCloseTo(10);
  });

  it('should calculate correct target profit and SL loss', () => {
    expect(component.targetProfit).toBeCloseTo(3.846, 2); // 0.1 * positionSize
    expect(component.slLoss).toBeCloseTo(1.923, 2);       // 0.05 * positionSize
  });

  it('should calculate correct RR ratio', () => {
    expect(component.rrRatio).toBeCloseTo(2, 1); // TP/SL
  });

  it('should reset to default values', () => {
    component.balance = 500;
    component.riskPercent = 2;
    component.reset();
    expect(component.balance).toBe(1000);
    expect(component.riskPercent).toBe(1);
    expect(component.entryPrice).toBe(2.6);
    expect(component.tpSlRatio).toBe(2);
  });
});
