import { Component, computed, inject, OnInit } from '@angular/core';
import { TickerStore } from '../../core/store/ticker.store';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'mag-ticker-panel',
  imports: [CommonModule],
  templateUrl: './ticker-panel.html',
  styleUrl: './ticker-panel.scss'
})
export class TickerPanel {
  private store = inject(TickerStore);
  tickers = this.store.tickers;
  count = computed(() => this.tickers().length);
}
