import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/services/auth.service';
import { PrediccionService } from '../../core/services/prediccion';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private authService     = inject(AuthService);
  private prediccionService = inject(PrediccionService);
  private router          = inject(Router);

  usuario       = this.authService.usuario;
  predicciones  = signal<any[]>([]);
  cargando      = signal(true);

  accesos = [
    { label: 'Buscar Licitaciones', icon: 'search',     ruta: '/licitaciones', color: '#3f51b5', desc: 'Explora contratos activos del SECOP II' },
    { label: 'Analizar Licitación', icon: 'analytics',  ruta: '/prediccion',   color: '#4caf50', desc: 'Predice tu probabilidad de éxito' },
    { label: 'Mi Empresa',          icon: 'business',   ruta: '/perfil',       color: '#ff9800', desc: 'Historial competitivo por NIT' },
    { label: 'Asistente IA',        icon: 'smart_toy',  ruta: '/asistente',    color: '#9c27b0', desc: 'Analiza pliegos y resuelve dudas' },
  ];

  ngOnInit() {
    this.prediccionService.getMias().subscribe({
      next: (res) => {
        this.predicciones.set(res.predicciones?.slice(0, 5) || []);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  getColorPorcentaje(pct: number): string {
    if (pct >= 65) return '#4caf50';
    if (pct >= 45) return '#ff9800';
    return '#f44336';
  }

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }
}