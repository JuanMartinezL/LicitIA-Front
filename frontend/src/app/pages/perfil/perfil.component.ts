import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { PerfilService } from '../../core/services/perfil';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTableModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.scss',
})
export class PerfilComponent implements OnInit {
  private perfilService = inject(PerfilService);
  private authService   = inject(AuthService);
  private fb            = inject(FormBuilder);

  usuario  = this.authService.usuario;
  perfil   = signal<any>(null);
  cargando = signal(false);
  error    = signal('');

  form: FormGroup;

  columnasContratos = ['entidad', 'tipo', 'valor', 'estado', 'fecha'];

  constructor() {
    this.form = this.fb.group({
      nit: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit() {
    const nit = this.usuario()?.nit;
    if (nit) {
      this.form.patchValue({ nit });
      this.buscar();
    }
  }

  buscar() {
    if (this.form.invalid) return;
    this.cargando.set(true);
    this.error.set('');
    this.perfil.set(null);

    this.perfilService.getByNit(this.form.value.nit).subscribe({
      next: (res) => {
        this.perfil.set(res.perfil);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'No se encontró historial para este NIT');
        this.cargando.set(false);
      },
    });
  }

  formatCuantia(valor: string): string {
    const num = parseFloat(valor);
    if (isNaN(num)) return '-';
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
}