import { TestBed } from '@angular/core/testing';

import { BackendlessService } from './backendless.service';

describe('BackendlessService', () => {
  let service: BackendlessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendlessService);
  });
});
