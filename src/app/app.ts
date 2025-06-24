import { Component } from '@angular/core';
import {Dashboard} from './layout/dashboard/dashboard';

@Component({
  selector: 'mag-root',
  imports: [Dashboard],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'crypto-mag';
}
