import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfitTargetCalculatorFacadeService {
  public balance = signal<number>(1000);
  public riskPercent = signal<number>(1);
  public entryPrice = signal<number>(2.6);
  public tpSlRatio = signal<number>(2);
  public leverage = signal<number>(10);
  public desiredProfit = signal<number>(50);
  public targetPrice = signal<number>(2.8);
  public direction = signal<'long' | 'short'>('long');
  public feesPercent = signal<number>(0.04);

  private autoTarget = signal<boolean>(true);

  public riskAmount = computed(() => (this.balance() * this.riskPercent()) / 100);

  public positionSize = computed(() => (this.riskAmount() * this.leverage()) / this.entryPrice());

  public notionalValue = computed(() => this.positionSize() * this.entryPrice());

  public usdtRequired = computed(() => this.riskAmount());

  public lots = computed(() => this.positionSize() / 100000);

  public totalFees = computed(() => {
    const feeRate = this.feesPercent() / 100;
    return this.positionSize() * this.entryPrice() * feeRate * 2;
  });

  public realFeeUsd = computed(() => this.totalFees());

  public realFeePercent = computed(() => (this.realFeeUsd() / this.riskAmount()) * 100);

  public tpDistance = computed(() => Math.abs(this.targetPrice() - this.entryPrice()));

  public slDistance = computed(() => this.tpDistance() / this.tpSlRatio());

  public stopLossPrice = computed(() => {
    return this.direction() === 'long'
      ? this.entryPrice() - this.slDistance()
      : this.entryPrice() + this.slDistance();
  });

  public targetProfit = computed(() => {
    const gross = this.tpDistance() * this.positionSize();
    return Math.max(gross - this.totalFees(), 0);
  });

  public targetProfitPercent = computed(() => (this.targetProfit() / this.riskAmount()) * 100);

  public slLoss = computed(() => {
    const gross = this.slDistance() * this.positionSize();
    return gross + this.totalFees();
  });

  public slLossPercent = computed(() => (this.slLoss() / this.riskAmount()) * 100);

  public rrRatio = computed(() => (this.slLoss() > 0 ? this.targetProfit() / this.slLoss() : 0));

  public breakEvenPrice = computed(() => {
    const feePerUnit = this.totalFees() / this.positionSize();
    return this.direction() === 'long'
      ? this.entryPrice() + feePerUnit
      : this.entryPrice() - feePerUnit;
  });

  public liquidationPrice = computed(() => {
    return this.direction() === 'long'
      ? this.entryPrice() * (1 - 1 / this.leverage())
      : this.entryPrice() * (1 + 1 / this.leverage());
  });

  onTargetPriceInput(): void {
    this.autoTarget.set(false);
    this.updateDerivedValues();
  }

  onDesiredProfitInput(): void {
    this.autoTarget.set(true);
    this.updateDerivedValues();
  }

  updateDerivedValues(): void {
    if (this.autoTarget()) {
      const total = this.desiredProfit() + this.totalFees();
      const priceDelta = total / this.positionSize();
      this.targetPrice.set(
        this.direction() === 'long'
          ? this.entryPrice() + priceDelta
          : this.entryPrice() - priceDelta,
      );
    } else {
      const priceDelta = Math.abs(this.targetPrice() - this.entryPrice());
      const gross = priceDelta * this.positionSize();
      this.desiredProfit.set(Math.max(gross - this.totalFees(), 0));
    }
  }

  reset(): void {
    this.balance.set(1000);
    this.riskPercent.set(1);
    this.entryPrice.set(2.6);
    this.tpSlRatio.set(2);
    this.leverage.set(10);
    this.desiredProfit.set(50);
    this.targetPrice.set(2.8);
    this.direction.set('long');
    this.autoTarget.set(true);
    this.updateDerivedValues();
  }
}

