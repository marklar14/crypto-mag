import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mag-ticker-card-skeleton',
  imports: [CommonModule],
  template: `
    <div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))">
      @for (_ of items; track $index) {
        <div
          class="bg-skin-panel rounded-xl p-4 shadow-sm text-sm flex flex-col animate-pulse space-y-2"
        >
          <div class="flex justify-between items-start">
            <div class="h-4 w-1/3 bg-skin-muted/30 rounded"></div>
            <div class="h-3 w-1/4 bg-skin-muted/20 rounded"></div>
          </div>

          <div class="h-6 w-2/3 bg-skin-muted/30 rounded"></div>
          <div class="h-3 w-1/3 bg-skin-muted/20 rounded"></div>

          <div class="space-y-1 mt-2 text-xs">
            <div class="h-3 w-3/4 bg-skin-muted/20 rounded"></div>
            <div class="h-3 w-2/3 bg-skin-muted/20 rounded"></div>
            <div class="h-3 w-2/4 bg-skin-muted/20 rounded"></div>
            <div class="h-3 w-3/5 bg-skin-muted/20 rounded"></div>
          </div>

          <div class="relative w-full h-1 bg-skin-muted/10 rounded mt-2 overflow-hidden">
            <div class="absolute h-full bg-skin-muted/30 rounded" style="width: 50%"></div>
          </div>
        </div>
      }
    </div>
  `,
})
export class TickerCardSkeleton {
  @Input() count = 4;

  get items() {
    return Array.from({ length: this.count });
  }
}
