import { signal, computed } from '@angular/core';

const accessToken = signal<string | null>(null);
const clientId = signal<string | null>(null);

export const isAuthenticated = computed(() => !!accessToken());

export const authStore = {
  accessToken,
  clientId,
  isAuthenticated,

  setToken(token: string, client: string) {
    accessToken.set(token);
    clientId.set(client);
  },

  clear() {
    accessToken.set(null);
    clientId.set(null);
  }
};
