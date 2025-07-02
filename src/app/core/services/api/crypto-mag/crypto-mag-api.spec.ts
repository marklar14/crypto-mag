import { TestBed } from '@angular/core/testing';

import { CryptoMagApi } from './crypto-mag-api';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CryptoMagApi', () => {
  let service: CryptoMagApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(),
        provideHttpClientTesting()]
    });
    service = TestBed.inject(CryptoMagApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
