import { Component, inject, OnInit, effect } from '@angular/core';
import { Dashboard } from './layout/dashboard/dashboard';
import { Auth } from './core/services/auth/auth';
import { TickerPollService } from './core/services/ticker/ticker-poll';
import { AuthStore } from './core/store/auth.store';

@Component({
  selector: 'mag-root',
  imports: [Dashboard],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private auth = inject(Auth);
  private tickerPoll = inject(TickerPollService);
  private authStore = inject(AuthStore);

  private started = false;

  constructor() {
    effect(() => {
      const authed = this.authStore.isAuthenticated();
      if (authed && !this.started) {
        this.tickerPoll.startPolling();
        this.started = true;
      }
    });
  }

  ngOnInit(): void {
    this.auth.login();
  }
}
