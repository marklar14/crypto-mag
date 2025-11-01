import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfitTargetCalculatorFacadeService } from '../../core/services/profit-target-calculator/profit-target-calculator-facade.service';

@Component({
  selector: 'mag-profit-target-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profit-target-calculator.html',
  styleUrl: './profit-target-calculator.scss',
})
export class ProfitTargetCalculator {
  private facade = inject(ProfitTargetCalculatorFacadeService);

  public balance = this.facade.balance;
  public riskPercent = this.facade.riskPercent;
  public entryPrice = this.facade.entryPrice;
  public tpSlRatio = this.facade.tpSlRatio;
  public leverage = this.facade.leverage;
  public desiredProfit = this.facade.desiredProfit;
  public targetPrice = this.facade.targetPrice;
  public direction = this.facade.direction;
  public feesPercent = this.facade.feesPercent;

  public riskAmount = this.facade.riskAmount;
  public positionSize = this.facade.positionSize;
  public notionalValue = this.facade.notionalValue;
  public usdtRequired = this.facade.usdtRequired;
  public lots = this.facade.lots;
  public totalFees = this.facade.totalFees;
  public realFeeUsd = this.facade.realFeeUsd;
  public realFeePercent = this.facade.realFeePercent;
  public tpDistance = this.facade.tpDistance;
  public slDistance = this.facade.slDistance;
  public stopLossPrice = this.facade.stopLossPrice;
  public targetProfit = this.facade.targetProfit;
  public targetProfitPercent = this.facade.targetProfitPercent;
  public slLoss = this.facade.slLoss;
  public slLossPercent = this.facade.slLossPercent;
  public rrRatio = this.facade.rrRatio;
  public breakEvenPrice = this.facade.breakEvenPrice;
  public liquidationPrice = this.facade.liquidationPrice;

  onTargetPriceInput(): void {
    this.facade.onTargetPriceInput();
  }

  onDesiredProfitInput(): void {
    this.facade.onDesiredProfitInput();
  }

  updateDerivedValues(): void {
    this.facade.updateDerivedValues();
  }

  reset(): void {
    this.facade.reset();
  }
}
