import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from '../../store/auth.store';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);

  login(): void {
    this.http
      .post<{
        access_token: string;
      }>(`${environment.apiBaseUrl}/auth/token`, {}, { headers: { 'x-api-key': environment.frontendApiKey } })
      .subscribe((response) => {
        this.authStore.setToken(response.access_token, 'frontend-angular-app');
      });
  }

  logout(): void {
    this.authStore.clear();
  }
}
