import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'mag-profit-target-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './profit-target-calculator.html',
  styleUrl: './profit-target-calculator.scss'
})
export class ProfitTargetCalculator {
  balance = 1000;
  riskPercent = 1;
  entryPrice = 2.6;
  targetPrice = 2.7;
  tpSlRatio = 2;
  leverage = 10;

  // 💥 Risk amount (user's risk %)
  get riskAmount(): number {
    return (this.balance * this.riskPercent) / 100;
  }

  get tpDistance(): number {
    return Math.abs(this.targetPrice - this.entryPrice);
  }

  get slDistance(): number {
    return this.tpDistance / this.tpSlRatio;
  }

  get stopLossPrice(): number {
    return this.entryPrice > this.targetPrice
      ? this.entryPrice + this.slDistance
      : this.entryPrice - this.slDistance;
  }

// ✅ Pozor: tady už používáme USDT required, které odpovídá marginu
  get notionalValue(): number {
    return this.riskAmount * this.leverage;
  }

// ✅ Počet jednotek za danou notional hodnotu
  get positionSize(): number {
    return this.notionalValue / this.entryPrice;
  }

// ✅ Margin (tvoje vlastní peníze)
  get usdtRequired(): number {
    return this.riskAmount;
  }

  get lots(): number {
    return this.positionSize / 100000;
  }

  get targetProfit(): number {
    return this.tpDistance * this.positionSize;
  }

  get slLoss(): number {
    return this.slDistance * this.positionSize;
  }

  get rrRatio(): number {
    return this.slLoss > 0 ? this.targetProfit / this.slLoss : 0;
  }

  reset(): void {
    this.balance = 1000;
    this.riskPercent = 1;
    this.entryPrice = 2.6;
    this.targetPrice = 2.7;
    this.tpSlRatio = 2;
    this.leverage = 10;
  }
}
