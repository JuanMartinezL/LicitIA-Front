import { TestBed } from '@angular/core/testing';

import { Asistente } from './asistente';

describe('Asistente', () => {
  let service: Asistente;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Asistente);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
