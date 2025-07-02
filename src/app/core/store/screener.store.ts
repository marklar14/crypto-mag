import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { MultiTimeframeData } from '../models/api/screener-result';

type ScreenerState = {
  results: MultiTimeframeData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  isLoading: boolean;
};

const initialState: ScreenerState = {
  results: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  isLoading: false,
};

export const ScreenerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },
    setResults(results: MultiTimeframeData[]): void {
      patchState(store, { results, isLoading: false });
    },
    setPagination(pagination: ScreenerState['pagination']): void {
      patchState(store, { pagination });
    },
    setData(data: {
      results: MultiTimeframeData[];
      pagination: ScreenerState['pagination'];
    }): void {
      patchState(store, {
        results: data.results,
        pagination: data.pagination,
        isLoading: false,
      });
    },
    clear(): void {
      patchState(store, {
        results: [],
        pagination: initialState.pagination,
        isLoading: false,
      });
    },
  })),
);
