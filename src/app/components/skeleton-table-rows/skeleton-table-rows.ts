import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mag-skeleton-grid-rows',
  imports: [CommonModule],
  template: `
    @for (_ of rows; track $index) {
      <div class="grid gap-4 py-2 animate-pulse" [ngClass]="'grid-cols-' + columnCount">
        @for (_ of cols; track $index) {
          <div class="h-5 w-full rounded bg-white/10 my-1"></div>
        }
      </div>
    }
  `,
})
export class SkeletonGridRows {
  @Input() rowCount = 6;
  @Input() columnCount = 6;

  get rows() {
    return Array.from({ length: this.rowCount });
  }
  get cols() {
    return Array.from({ length: this.columnCount });
  }
}
