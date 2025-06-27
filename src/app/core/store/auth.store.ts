import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';

type AuthState = {
  accessToken: string | null;
  clientId: string | null;
};

const initialAuthState: AuthState = {
  accessToken: null,
  clientId: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialAuthState),
  withMethods((store) => ({
    setToken(accessToken: string, clientId: string): void {
      patchState(store, { accessToken, clientId });
    },
    clear(): void {
      patchState(store, { accessToken: null, clientId: null });
    },
  })),
  withComputed((state) => ({
    isAuthenticated: computed(() => !!state.accessToken()),
  }))
);
