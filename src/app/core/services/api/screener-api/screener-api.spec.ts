import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ScreenerApi } from './screener-api';

describe('ScreenerApi', () => {
  let service: ScreenerApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ScreenerApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
