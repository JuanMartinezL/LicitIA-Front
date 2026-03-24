import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


export interface Usuario {
  id:      string;
  nombre:  string;
  email:   string;
  nit:     string;
  empresa: string;
  sector:  string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'licitia_token';
  private readonly URL = environment.apiUrl;

  private platformId = inject(PLATFORM_ID);

  // Signal reactivo — cualquier componente puede leer el usuario actual
  usuario = signal<Usuario | null>(null)

  constructor(private http: HttpClient, private router: Router) {
    this.usuario.set(this.cargarUsuarioLocal());
  }

  registro(datos: {
    nombre: string;
    email: string;
    password: string;
    empresa: string;
    nit: string;
  }) {
    return this.http.post<any>(`${this.URL}/auth/registro`, datos).pipe(
      tap(res => this.guardarSesion(res))
    );
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.URL}/auth/login`, { email, password }).pipe(
      tap(res => this.guardarSesion(res))
    );
  }

  logout() {
    if(isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('licitia_usuario');
      this.usuario.set(null);
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    if(isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

   private guardarSesion(res: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, res.token);
      localStorage.setItem('licitia_usuario', JSON.stringify(res.usuario));
    }
    this.usuario.set(res.usuario);
  }

  private cargarUsuarioLocal(): Usuario | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    try {
      const raw = localStorage.getItem('licitia_usuario');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}