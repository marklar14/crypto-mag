import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

@Component({
  selector: 'mag-pagination',
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between mt-4">
      <!-- Info -->
      <div class="text-sm text-skin-muted">
        @if (pagination()) {
          Showing {{ startItem() }}-{{ endItem() }} of {{ pagination()!.total }} results
        }
      </div>

      <!-- Pagination Controls -->
      @if (pagination()) {
        <div class="flex items-center gap-2">
          <!-- Previous Button -->
          <button
            [disabled]="!pagination()!.hasPrev"
            (click)="pageChange.emit(pagination()!.page - 1)"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-skin-muted/20 hover:bg-skin-muted/30 text-skin-text"
          >
            ← Previous
          </button>

          <!-- Page Numbers -->
          <div class="flex gap-1">
            @for (page of visiblePages(); track page) {
              @if (page === '...') {
                <span class="px-3 py-2 text-skin-muted">...</span>
              } @else {
                <button
                  [class.bg-skin-accent]="page === pagination()!.page"
                  [class.text-skin-text]="page === pagination()!.page"
                  [class.text-skin-muted]="page !== pagination()!.page"
                  (click)="pageChange.emit(typeof page === 'number' ? page : 1)"
                  class="px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-skin-muted/20"
                >
                  {{ page }}
                </button>
              }
            }
          </div>

          <!-- Next Button -->
          <button
            [disabled]="!pagination()!.hasNext"
            (click)="pageChange.emit(pagination()!.page + 1)"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-skin-muted/20 hover:bg-skin-muted/30 text-skin-text"
          >
            Next →
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class Pagination {
  pagination = input<PaginationData | null>(null);
  pageChange = output<number>();

  startItem = computed(() => {
    const pag = this.pagination();
    if (!pag) return 0;
    return (pag.page - 1) * pag.limit + 1;
  });

  endItem = computed(() => {
    const pag = this.pagination();
    if (!pag) return 0;
    return Math.min(pag.page * pag.limit, pag.total);
  });

  visiblePages = computed((): (number | string)[] => {
    const pag = this.pagination();
    if (!pag) return [];

    const current = pag.page;
    const total = pag.totalPages;
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  });
}
