import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'mag-screener',
  imports: [CommonModule],
  templateUrl: './screener.html',
  styleUrl: './screener.scss'
})
export class Screener {
  loading = true;

  screenResults: {
    symbol: string;
    lastPrice: number;
    changePercent: number;
    volume24h: number;
    rsi?: number;
    signal?: string;
  }[] = [];

  ngOnInit(): void {
    // TODO: Replace with real API call later
    setTimeout(() => {
      this.screenResults = [
        {
          symbol: 'BTCUSDT',
          lastPrice: 65500,
          changePercent: 3.2,
          volume24h: 5120000000,
          rsi: 28.5,
          signal: 'RSI Oversold',
        },
        {
          symbol: 'ETHUSDT',
          lastPrice: 3450,
          changePercent: -1.7,
          volume24h: 1900000000,
        },
      ];
      this.loading = false;
    }, 500);
  }
}
