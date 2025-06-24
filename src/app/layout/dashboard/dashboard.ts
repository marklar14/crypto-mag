import { Component } from '@angular/core';
import {Header} from '../../components/header/header';
import {Logo} from '../../components/logo/logo';
import {ProfitTargetCalculator} from '../../components/profit-target-calculator/profit-target-calculator';
import {Screener} from '../../components/screener/screener';
import { TickerPanel } from '../../components/ticker-panel/ticker-panel';


@Component({
  selector: 'mag-dashboard',
  standalone: true,
  imports: [Header, Logo, TickerPanel, ProfitTargetCalculator, Screener],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
