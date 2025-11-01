import { Injectable } from '@angular/core';
import { DCALevel } from './dca-risk-calculator-facade.service';

@Injectable({
  providedIn: 'root',
})
export class DcaRiskCalculatorUiService {
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

