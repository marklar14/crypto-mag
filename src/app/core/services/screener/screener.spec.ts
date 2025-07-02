import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ScreenerService } from './screener';

describe('ScreenerService', () => {
  let service: ScreenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ScreenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
