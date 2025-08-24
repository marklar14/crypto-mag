import { Component } from '@angular/core';
import { RealTimeScanner } from '../real-time-scanner/real-time-scanner';

@Component({
  selector: 'mag-real-time-scanner-page',
  imports: [RealTimeScanner],
  template: `
    <div class="min-h-screen bg-skin-base text-skin-text p-6">
      <div class="max-w-7xl mx-auto">
        <mag-real-time-scanner />
      </div>
    </div>
  `,
  styles: [],
})
export class RealTimeScannerPage {}
