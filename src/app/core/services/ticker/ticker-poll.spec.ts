import { TestBed } from '@angular/core/testing';
import { TickerPollService } from './ticker-poll';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';



describe('TickerPollService ', () => {
  let service: TickerPollService ;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(),
        provideHttpClientTesting()]
    });
    service = TestBed.inject(TickerPollService );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
