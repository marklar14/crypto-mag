import { Injectable, signal, computed } from '@angular/core';

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

@Injectable({
  providedIn: 'root',
})
export class DcaRiskCalculatorFacadeService {
  public entryPrice = signal<number>(50000);
  public balance = signal<number>(10000);
  public riskPercent = signal<number>(5);
  public leverage = signal<number>(2);
  public numberOfLevels = signal<number>(5);
  public pullbackPercent = signal<number>(30);
  public growLeverage = signal<boolean>(false);
  public targetSellPrice = signal<number>(60000);

  public totalRiskAmount = computed(() => (this.balance() * this.riskPercent()) / 100);

  public dcaLevels = computed(() => {
    const levels: DCALevel[] = [];
    const totalRisk = this.totalRiskAmount();
    const basePrice = this.entryPrice();
    const pullback = this.pullbackPercent() / 100;
    const levelsCount = this.numberOfLevels();
    const baseLeverage = this.leverage();
    const shouldGrowLeverage = this.growLeverage();
    const targetPrice = this.targetSellPrice();

    const positionIncreaseFactor = 1.5;

    for (let i = 0; i < levelsCount; i++) {
      const level = i + 1;
      const pullbackPercent = (pullback * i) / (levelsCount - 1);
      const entryPrice = basePrice * (1 - pullbackPercent);

      let levelLeverage = baseLeverage;
      if (shouldGrowLeverage) {
        levelLeverage = Math.round(baseLeverage * Math.pow(1.5, i));
      }

      const positionSizeMultiplier = Math.pow(positionIncreaseFactor, i);
      const basePositionSize = totalRisk / levelsCount;
      const positionSize = basePositionSize * positionSizeMultiplier;

      const riskAmount = positionSize / levelLeverage;
      const cumulativeRisk = levels.reduce((sum, l) => sum + l.riskAmount, 0) + riskAmount;

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

  public averageEntryPrice = computed(() => {
    const levels = this.dcaLevels();
    if (levels.length === 0) return 0;

    const totalValue = levels.reduce(
      (sum, level) => sum + level.entryPrice * level.positionSize,
      0,
    );
    const totalPosition = levels.reduce((sum, level) => sum + level.positionSize, 0);

    return totalValue / totalPosition;
  });

  public totalPositionSize = computed(() =>
    this.dcaLevels().reduce((sum, level) => sum + level.positionSize, 0),
  );

  public totalNotionalValue = computed(() =>
    this.dcaLevels().reduce((sum, level) => sum + level.entryPrice * level.positionSize, 0),
  );

  public totalUsdtRequired = computed(() => {
    const levels = this.dcaLevels();
    return levels.reduce(
      (sum, level) => sum + (level.entryPrice * level.positionSize) / level.leverage,
      0,
    );
  });

  public averageLeverage = computed(() => {
    const levels = this.dcaLevels();
    if (levels.length === 0) return 0;
    return levels.reduce((sum, level) => sum + level.leverage, 0) / levels.length;
  });

  public totalProfitIfTargetHit = computed(() =>
    this.dcaLevels().reduce((sum, level) => sum + level.profitIfTargetHit, 0),
  );

  public averageProfitPercent = computed(() => {
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
}

