import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { RealTimeSignalApi, RealTimeSignalsMetadata } from '../models/api/real-time-signals-api';

type RealTimeSignalsState = {
  signals: RealTimeSignalApi[];
  metadata: RealTimeSignalsMetadata | null;
  isLoading: boolean;
};

const initialState: RealTimeSignalsState = {
  signals: [],
  metadata: null,
  isLoading: true,
};

export const RealTimeSignalsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },
    setSignals(signals: RealTimeSignalApi[], metadata: RealTimeSignalsMetadata | null): void {
      patchState(store, { signals, metadata, isLoading: false });
    },
    clear(): void {
      patchState(store, { signals: [], metadata: null, isLoading: false });
    },
  })),
);
