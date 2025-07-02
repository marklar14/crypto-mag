import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DCALevel {
  level: number;
  entryPrice: number;
  pullbackPercent: number;
  positionSize: number;
  leverage: number;
  riskAmount: number;
  cumulativeRisk: number;
  targetProfit: number;
  profitIfTargetHit: number;
}

@Component({
  selector: 'mag-dca-risk-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './dca-risk-calculator.html',
  styleUrl: './dca-risk-calculator.scss',
})
export class DcaRiskCalculator {
  // Input parameters
  entryPrice = signal<number>(50000);
  balance = signal<number>(10000);
  riskPercent = signal<number>(5);
  leverage = signal<number>(2);
  numberOfLevels = signal<number>(5);
  pullbackPercent = signal<number>(30);
  growLeverage = signal<boolean>(false);
  targetSellPrice = signal<number>(60000);

  // Computed values
  totalRiskAmount = computed(() => (this.balance() * this.riskPercent()) / 100);

  dcaLevels = computed(() => {
    const levels: DCALevel[] = [];
    const totalRisk = this.totalRiskAmount();
    const basePrice = this.entryPrice();
    const pullback = this.pullbackPercent() / 100;
    const levelsCount = this.numberOfLevels();
    const baseLeverage = this.leverage();
    const shouldGrowLeverage = this.growLeverage();
    const targetPrice = this.targetSellPrice();

    // Calculate position size increase factor (larger positions at lower prices)
    const positionIncreaseFactor = 1.5; // Each level gets 50% larger position

    for (let i = 0; i < levelsCount; i++) {
      const level = i + 1;
      const pullbackPercent = (pullback * i) / (levelsCount - 1);
      const entryPrice = basePrice * (1 - pullbackPercent);

      // Calculate leverage for this level
      let levelLeverage = baseLeverage;
      if (shouldGrowLeverage) {
        // Exponential leverage growth: 2x → 3x → 5x → 8x → 12x
        levelLeverage = Math.round(baseLeverage * Math.pow(1.5, i));
      }

      // Position size increases with each level (more aggressive at lower prices)
      const positionSizeMultiplier = Math.pow(positionIncreaseFactor, i);
      const basePositionSize = totalRisk / levelsCount;
      const positionSize = basePositionSize * positionSizeMultiplier;

      // Risk per level (increases with position size and leverage)
      const riskAmount = positionSize / levelLeverage;
      const cumulativeRisk = levels.reduce((sum, l) => sum + l.riskAmount, 0) + riskAmount;

      // Calculate profit for this level
      const priceDifference = targetPrice - entryPrice;
      const profitPercent = (priceDifference / entryPrice) * 100;
      const profitIfTargetHit = (positionSize * priceDifference) / entryPrice;

      levels.push({
        level,
        entryPrice,
        pullbackPercent: pullbackPercent * 100,
        positionSize,
        leverage: levelLeverage,
        riskAmount,
        cumulativeRisk,
        targetProfit: profitPercent,
        profitIfTargetHit,
      });
    }

    return levels;
  });

  averageEntryPrice = computed(() => {
    const levels = this.dcaLevels();
    if (levels.length === 0) return 0;

    const totalValue = levels.reduce(
      (sum, level) => sum + level.entryPrice * level.positionSize,
      0,
    );
    const totalPosition = levels.reduce((sum, level) => sum + level.positionSize, 0);

    return totalValue / totalPosition;
  });

  totalPositionSize = computed(() =>
    this.dcaLevels().reduce((sum, level) => sum + level.positionSize, 0),
  );

  totalNotionalValue = computed(() =>
    this.dcaLevels().reduce((sum, level) => sum + level.entryPrice * level.positionSize, 0),
  );

  totalUsdtRequired = computed(() => {
    const levels = this.dcaLevels();
    return levels.reduce(
      (sum, level) => sum + (level.entryPrice * level.positionSize) / level.leverage,
      0,
    );
  });

  averageLeverage = computed(() => {
    const levels = this.dcaLevels();
    if (levels.length === 0) return 0;
    return levels.reduce((sum, level) => sum + level.leverage, 0) / levels.length;
  });

  totalProfitIfTargetHit = computed(() =>
    this.dcaLevels().reduce((sum, level) => sum + level.profitIfTargetHit, 0),
  );

  averageProfitPercent = computed(() => {
    const levels = this.dcaLevels();
    if (levels.length === 0) return 0;
    return levels.reduce((sum, level) => sum + level.targetProfit, 0) / levels.length;
  });

  reset(): void {
    this.entryPrice.set(50000);
    this.balance.set(10000);
    this.riskPercent.set(5);
    this.leverage.set(2);
    this.numberOfLevels.set(5);
    this.pullbackPercent.set(30);
    this.growLeverage.set(false);
    this.targetSellPrice.set(60000);
  }

  getLevelColor(level: DCALevel): string {
    const pullback = level.pullbackPercent;
    if (pullback <= 10) return 'text-skin-success';
    if (pullback <= 20) return 'text-skin-warning';
    return 'text-skin-danger';
  }

  getLevelBgColor(level: DCALevel): string {
    const pullback = level.pullbackPercent;
    if (pullback <= 10) return 'bg-skin-success/10';
    if (pullback <= 20) return 'bg-skin-warning/10';
    return 'bg-skin-danger/10';
  }

  getLeverageColor(leverage: number): string {
    if (leverage <= 3) return 'text-skin-success';
    if (leverage <= 5) return 'text-skin-warning';
    return 'text-skin-danger';
  }

  getProfitColor(profit: number): string {
    if (profit > 0) return 'text-skin-success';
    if (profit < 0) return 'text-skin-danger';
    return 'text-skin-muted';
  }
}
