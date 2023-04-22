import { TestBed } from '@angular/core/testing';

import { ResponsecacheInterceptor } from './responsecache.interceptor';

describe('ResponsecacheInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ResponsecacheInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ResponsecacheInterceptor = TestBed.inject(ResponsecacheInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
