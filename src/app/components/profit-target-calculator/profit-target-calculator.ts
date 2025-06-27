import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mag-profit-target-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profit-target-calculator.html',
  styleUrl: './profit-target-calculator.scss'
})
export class ProfitTargetCalculator {
  balance = 1000;
  riskPercent = 1;
  entryPrice = 2.6;
  tpSlRatio = 2;
  leverage = 10;
  desiredProfit = 50;
  targetPrice = 2.8;
  direction: 'long' | 'short' = 'long';
  feesPercent = 0.04;

  private autoTarget = true;

  onTargetPriceInput() {
    this.autoTarget = false;
    this.updateDerivedValues();
  }

  onDesiredProfitInput() {
    this.autoTarget = true;
    this.updateDerivedValues();
  }

  updateDerivedValues() {
    const feeRate = this.feesPercent / 100;
    const risk = this.riskAmount;
    const position = this.positionSize;

    if (this.autoTarget) {
      const total = this.desiredProfit + this.totalFees;
      const priceDelta = total / position;
      this.targetPrice = this.direction === 'long'
        ? this.entryPrice + priceDelta
        : this.entryPrice - priceDelta;
    } else {
      const priceDelta = Math.abs(this.targetPrice - this.entryPrice);
      const gross = priceDelta * position;
      this.desiredProfit = Math.max(gross - this.totalFees, 0);
    }
  }

  get riskAmount(): number {
    return (this.balance * this.riskPercent) / 100;
  }

  get positionSize(): number {
    return (this.riskAmount * this.leverage) / this.entryPrice;
  }

  get notionalValue(): number {
    return this.positionSize * this.entryPrice;
  }

  get usdtRequired(): number {
    return this.riskAmount;
  }

  get lots(): number {
    return this.positionSize / 100000;
  }

  get totalFees(): number {
    const feeRate = this.feesPercent / 100;
    return this.positionSize * this.entryPrice * feeRate * 2;
  }

  get realFeeUsd(): number {
    return this.totalFees;
  }

  get realFeePercent(): number {
    return (this.realFeeUsd / this.riskAmount) * 100;
  }

  get tpDistance(): number {
    return Math.abs(this.targetPrice - this.entryPrice);
  }

  get slDistance(): number {
    return this.tpDistance / this.tpSlRatio;
  }

  get stopLossPrice(): number {
    return this.direction === 'long'
      ? this.entryPrice - this.slDistance
      : this.entryPrice + this.slDistance;
  }

  get targetProfit(): number {
    const gross = this.tpDistance * this.positionSize;
    return Math.max(gross - this.totalFees, 0);
  }

  get targetProfitPercent(): number {
    return (this.targetProfit / this.riskAmount) * 100;
  }

  get slLoss(): number {
    const gross = this.slDistance * this.positionSize;
    return gross + this.totalFees;
  }

  get slLossPercent(): number {
    return (this.slLoss / this.riskAmount) * 100;
  }

  get rrRatio(): number {
    return this.slLoss > 0 ? this.targetProfit / this.slLoss : 0;
  }

  get breakEvenPrice(): number {
    const feePerUnit = this.totalFees / this.positionSize;
    return this.direction === 'long'
      ? this.entryPrice + feePerUnit
      : this.entryPrice - feePerUnit;
  }

  get liquidationPrice(): number {
    return this.direction === 'long'
      ? this.entryPrice * (1 - 1 / this.leverage)
      : this.entryPrice * (1 + 1 / this.leverage);
  }

  reset(): void {
    this.balance = 1000;
    this.riskPercent = 1;
    this.entryPrice = 2.6;
    this.tpSlRatio = 2;
    this.leverage = 10;
    this.desiredProfit = 50;
    this.targetPrice = 2.8;
    this.direction = 'long';
    this.autoTarget = true;
    this.updateDerivedValues();
  }
}
