import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mag-skeleton-grid-rows',
  imports: [CommonModule],
  template: `
    @for (_ of rows(); track $index) {
      <div class="grid gap-4 py-2 animate-pulse" [ngClass]="'grid-cols-' + columnCount()">
        @for (_ of cols(); track $index) {
          <div class="h-5 w-full rounded bg-white/10 my-1"></div>
        }
      </div>
    }
  `,
})
export class SkeletonGridRows {
  rowCount = input<number>(6);
  columnCount = input<number>(6);

  rows = computed(() => {
    return Array.from({ length: this.rowCount() });
  });

  cols = computed(() => {
    return Array.from({ length: this.columnCount() });
  });
}
