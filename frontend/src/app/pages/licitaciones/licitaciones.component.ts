import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LicitacionesService } from '../../core/services/licitaciones';

@Component({
  selector: 'app-licitaciones',
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
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './licitaciones.component.html',
  styleUrl: './licitaciones.scss',
})
export class LicitacionesComponent implements OnInit {
  private licitacionesService = inject(LicitacionesService);
  private fb                  = inject(FormBuilder);
  private router              = inject(Router);

  licitaciones = signal<any[]>([]);
  sectores     = signal<string[]>([]);
  cargando     = signal(false);
  buscado      = signal(false);

  estados = ['En ejecución', 'Cerrado', 'Modificado'];

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      tipo_contrato: [''],
      municipio:     [''],
      departamento:  [''],
      estado:        [''],
      valor_min:     [''],
      valor_max:     [''],
    });
  }

  ngOnInit() {
    this.licitacionesService.getSectores().subscribe({
      next: (res) => this.sectores.set(res.sectores || []),
    });
    this.buscar();
  }

  buscar() {
    this.cargando.set(true);
    this.buscado.set(true);

    const filtros = Object.fromEntries(
      Object.entries(this.form.value).filter(([_, v]) => v !== '' && v !== null)
    );

    this.licitacionesService.getAll({ ...filtros, limit: 20 }).subscribe({
      next: (res) => {
        this.licitaciones.set(res.licitaciones || []);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  limpiar() {
    this.form.reset();
    this.buscar();
  }

  irAPrediccion(l: any) {
    this.router.navigate(['/prediccion'], {
      state: {
        entidad:   l.nombre_entidad,
        sector:    l.tipo_de_contrato,
        municipio: l.ciudad,
        modalidad: l.modalidad_de_contratacion,
        cuantia:   l.valor_del_contrato,
      },
    });
  }

  formatCuantia(valor: string): string {
    const num = parseFloat(valor);
    if (isNaN(num)) return 'No definido';
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000)     return `$${(num / 1_000_000).toFixed(1)}M`;
    return `$${(num / 1_000).toFixed(0)}K`;
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'En ejecución': return '#4caf50';
      case 'Modificado':   return '#ff9800';
      case 'Cerrado':      return '#9e9e9e';
      default:             return '#3f51b5';
    }
  }

  abrirSecop(url: any) {
    if (url?.url) window.open(url.url, '_blank');
  }
}