import { TestBed } from '@angular/core/testing';

import { AuthtokenGuard } from './authtoken.guard';

describe('AuthtokenGuard', () => {
  let guard: AuthtokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthtokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
