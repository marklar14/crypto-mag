import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { Ticker } from '../models/ticker';


type TickerState = {
  tickers: Ticker[];
  isLoading: boolean;
};

const initialState: TickerState = {
  tickers: [],
  isLoading: false,
};

export const TickerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },
    setTickers(tickers: Ticker[]): void {
      patchState(store, { tickers, isLoading: false });
    },
  }))
);
