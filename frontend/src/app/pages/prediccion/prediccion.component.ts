import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { PrediccionService } from '../../core/services/prediccion';
import { LicitacionesService } from '../../core/services/licitaciones';

@Component({
  selector: 'app-prediccion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule,
  ],
  templateUrl: './prediccion.component.html',
  styleUrl: './prediccion.scss',
})
export class PrediccionComponent implements OnInit {
  private prediccionService  = inject(PrediccionService);
  private licitacionesService = inject(LicitacionesService);
  private fb                 = inject(FormBuilder);

  form: FormGroup;
  resultado     = signal<any>(null);
  historial     = signal<any[]>([]);
  cargando      = signal(false);
  cargandoHist  = signal(true);
  sectores      = signal<string[]>([]);

  modalidades = [
    'Licitación Pública',
    'Selección Abreviada',
    'Concurso de Méritos',
    'Contratación Directa',
    'Mínima Cuantía',
    'Contratación régimen especial',
  ];

  constructor() {
    this.form = this.fb.group({
      entidad:   ['', Validators.required],
      cuantia:   ['', [Validators.required, Validators.min(1)]],
      sector:    ['', Validators.required],
      municipio: [''],
      modalidad: [''],
    });
  }

  ngOnInit() {
    this.licitacionesService.getSectores().subscribe({
      next: (res) => this.sectores.set(res.sectores || []),
    });

    this.prediccionService.getMias().subscribe({
      next: (res) => {
        this.historial.set(res.predicciones || []);
        this.cargandoHist.set(false);
      },
      error: () => this.cargandoHist.set(false),
    });
  }

  analizar() {
    if (this.form.invalid) return;
    this.cargando.set(true);
    this.resultado.set(null);

    const datos = {
      ...this.form.value,
      cuantia: parseFloat(this.form.value.cuantia),
    };

    this.prediccionService.analizar(datos).subscribe({
      next: (res) => {
        this.resultado.set(res);
        this.cargando.set(false);
        // Agregar al historial local
        this.historial.update(h => [res, ...h]);
      },
      error: () => this.cargando.set(false),
    });
  }

  limpiar() {
    this.form.reset();
    this.resultado.set(null);
  }

  getColor(pct: number): string {
    if (pct >= 65) return '#4caf50';
    if (pct >= 45) return '#ff9800';
    return '#f44336';
  }

  getLabel(pct: number): string {
    if (pct >= 65) return 'Alta probabilidad';
    if (pct >= 45) return 'Probabilidad media';
    return 'Baja probabilidad';
  }
}