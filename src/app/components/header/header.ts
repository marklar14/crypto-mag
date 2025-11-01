import { Component, input } from '@angular/core';

@Component({
  selector: 'mag-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  title = input<string>('Welcome');
}
