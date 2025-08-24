import { Component, Input } from '@angular/core';

@Component({
  selector: 'mag-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() title = 'Welcome';
}
