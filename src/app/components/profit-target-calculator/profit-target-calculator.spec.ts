import { ProfitTargetCalculator } from './profit-target-calculator';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProfitTargetCalculator logic', () => {
  let component: ProfitTargetCalculator;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    component = new ProfitTargetCalculator();

    component.balance = 1000;
    component.riskPercent = 1;
    component.entryPrice = 2.6;
    component.tpSlRatio = 2;
    component.leverage = 10;

    component.targetPrice = 2.7;
    (component as any).autoTarget = false;
    component.updateDerivedValues();
  });

  it('should calculate correct risk amount', () => {
    expect(component.riskAmount).toBeCloseTo(10);
  });

  it('should calculate correct TP and SL distances', () => {
    const expectedTPDistance = Math.abs(component.targetPrice - component.entryPrice);
    const expectedSLDistance = expectedTPDistance / component.tpSlRatio;

    expect(component.tpDistance).toBeCloseTo(expectedTPDistance, 4);
    expect(component.slDistance).toBeCloseTo(expectedSLDistance, 4);
  });

  it('should calculate correct stop loss price (long position)', () => {
    const expectedSL = component.entryPrice - component.slDistance;
    expect(component.stopLossPrice).toBeCloseTo(expectedSL, 4);
  });

  it('should calculate correct position size and notional value', () => {
    const expectedPositionSize = (component.riskAmount * component.leverage) / component.entryPrice;
    const expectedNotional = expectedPositionSize * component.entryPrice;

    expect(component.positionSize).toBeCloseTo(expectedPositionSize, 4);
    expect(component.notionalValue).toBeCloseTo(expectedNotional, 4);
  });

  it('should calculate correct USDT required (margin)', () => {
    expect(component.usdtRequired).toBeCloseTo(component.riskAmount, 4);
  });

  it('should calculate correct target profit and SL loss (with fees)', () => {
    const feeRate = component.feesPercent / 100;
    const fees = component.positionSize * component.entryPrice * feeRate * 2;

    const tpGross = component.tpDistance * component.positionSize;
    const slGross = component.slDistance * component.positionSize;

    const expectedTP = Math.max(tpGross - fees, 0);
    const expectedSL = slGross + fees;

    expect(component.targetProfit).toBeCloseTo(expectedTP, 4);
    expect(component.slLoss).toBeCloseTo(expectedSL, 4);
  });

  it('should calculate correct RR ratio', () => {
    const rr = component.targetProfit / component.slLoss;
    expect(component.rrRatio).toBeCloseTo(rr, 4);
  });

  it('should calculate correct break-even price', () => {
    const feePerUnit = component.totalFees / component.positionSize;
    const expected = component.entryPrice + feePerUnit;
    expect(component.breakEvenPrice).toBeCloseTo(expected, 4);
  });

  it('should calculate correct liquidation price (long)', () => {
    const expected = component.entryPrice * (1 - 1 / component.leverage);
    expect(component.liquidationPrice).toBeCloseTo(expected, 4);
  });

  it('should reset to default values', () => {
    component.balance = 999;
    component.riskPercent = 9;
    component.reset();

    expect(component.balance).toBe(1000);
    expect(component.riskPercent).toBe(1);
    expect(component.entryPrice).toBe(2.6);
    expect(component.tpSlRatio).toBe(2);
    expect(component.leverage).toBe(10);
    expect(component.desiredProfit).toBe(50);
    expect(component.direction).toBe('long');
    expect((component as any).autoTarget).toBeTrue();

    const expectedTP =
      component.entryPrice +
      (component.desiredProfit + component.totalFees) / component.positionSize;
    expect(component.targetPrice).toBeCloseTo(expectedTP, 4);
  });

  it('should calculate targetPrice from desiredProfit (autoTarget = true)', () => {
    component.desiredProfit = 25;
    (component as any).autoTarget = true;
    component.updateDerivedValues();

    const total = component.desiredProfit + component.totalFees;
    const expectedDelta = total / component.positionSize;
    const expectedTargetPrice = component.entryPrice + expectedDelta;

    expect(component.targetPrice).toBeCloseTo(expectedTargetPrice, 4);
  });
});
