import { TestBed } from '@angular/core/testing';

import { InviteServiceResolver } from './invite-resolver.service';

describe('InviteServiceResolver', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InviteServiceResolver = TestBed.get(InviteServiceResolver);
    expect(service).toBeTruthy();
  });
});
