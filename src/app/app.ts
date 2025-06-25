import { Component, inject } from '@angular/core';
import {Dashboard} from './layout/dashboard/dashboard';
import { Auth } from './core/services/auth/auth';
import { environment } from '../environments/environment';
import { TickerPollService } from './core/services/ticker/ticker-poll';

@Component({
  selector: 'mag-root',
  imports: [Dashboard],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private auth = inject(Auth);
  private ticker = inject(TickerPollService);
  constructor() {
    this.auth.login(environment.frontendApiKey);
  }
}
