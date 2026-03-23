import { TestBed } from '@angular/core/testing';

import { Licitaciones } from './licitaciones';

describe('Licitaciones', () => {
  let service: Licitaciones;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Licitaciones);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
