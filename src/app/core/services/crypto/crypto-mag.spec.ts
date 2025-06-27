import { TestBed } from '@angular/core/testing';

import { CryptoMag } from './crypto-mag';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('CryptoMag', () => {
  let service: CryptoMag;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(),
      provideHttpClientTesting()]
    });
    service = TestBed.inject(CryptoMag);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
