import { TestBed } from '@angular/core/testing';

import { ServicesListService } from './services-list.service';

describe('ServicesListService', () => {
  let service: ServicesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
