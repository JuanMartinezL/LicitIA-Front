import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface FiltrosLicitacion {
  tipo_contrato?: string;
  municipio?:     string;
  departamento?:  string;
  valor_min?:     number;
  valor_max?:     number;
  estado?:        string;
  limit?:         number;
  offset?:        number;
}

@Injectable({ providedIn: 'root' })
export class LicitacionesService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/licitaciones`;

  getAll(filtros: FiltrosLicitacion = {}) {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, String(val));
      }
    });
    return this.http.get<any>(this.url, { params });
  }

  getById(id: string) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  getSectores() {
    return this.http.get<any>(`${this.url}/sectores`);
  }
}