import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DcaRiskCalculatorFacadeService, DCALevel } from '../../core/services/dca-risk-calculator/dca-risk-calculator-facade.service';
import { DcaRiskCalculatorUiService } from '../../core/services/dca-risk-calculator/dca-risk-calculator-ui.service';

@Component({
  selector: 'mag-dca-risk-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './dca-risk-calculator.html',
  styleUrl: './dca-risk-calculator.scss',
})
export class DcaRiskCalculator {
  private facade = inject(DcaRiskCalculatorFacadeService);
  public ui = inject(DcaRiskCalculatorUiService);

  public entryPrice = this.facade.entryPrice;
  public balance = this.facade.balance;
  public riskPercent = this.facade.riskPercent;
  public leverage = this.facade.leverage;
  public numberOfLevels = this.facade.numberOfLevels;
  public pullbackPercent = this.facade.pullbackPercent;
  public growLeverage = this.facade.growLeverage;
  public targetSellPrice = this.facade.targetSellPrice;
  public totalRiskAmount = this.facade.totalRiskAmount;
  public dcaLevels = this.facade.dcaLevels;
  public averageEntryPrice = this.facade.averageEntryPrice;
  public totalPositionSize = this.facade.totalPositionSize;
  public totalNotionalValue = this.facade.totalNotionalValue;
  public totalUsdtRequired = this.facade.totalUsdtRequired;
  public averageLeverage = this.facade.averageLeverage;
  public totalProfitIfTargetHit = this.facade.totalProfitIfTargetHit;
  public averageProfitPercent = this.facade.averageProfitPercent;

  reset(): void {
    this.facade.reset();
  }

  getLevelColor(level: DCALevel): string {
    return this.ui.getLevelColor(level);
  }

  getLevelBgColor(level: DCALevel): string {
    return this.ui.getLevelBgColor(level);
  }

  getLeverageColor(leverage: number): string {
    return this.ui.getLeverageColor(leverage);
  }

  getProfitColor(profit: number): string {
    return this.ui.getProfitColor(profit);
  }
}
