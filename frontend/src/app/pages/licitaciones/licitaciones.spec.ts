import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicitacionesComponent } from './licitaciones.component';

describe('Licitaciones', () => {
  let component: LicitacionesComponent;
  let fixture: ComponentFixture<LicitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicitacionesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LicitacionesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
