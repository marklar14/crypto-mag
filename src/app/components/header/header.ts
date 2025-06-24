import {Component, Input } from '@angular/core';

@Component({
  selector: 'mag-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  @Input() title = 'Welcome';
}
