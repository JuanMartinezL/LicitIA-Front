import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface PrediccionInput {
  entidad:    string;
  cuantia:    number;
  sector:     string;
  municipio?: string;
  modalidad?: string;
}

export interface PrediccionResult {
  ok:                 boolean;
  prediccion_id:      string;
  probabilidad:       number;
  porcentaje:         number;
  factores_positivos: string[];
  factores_negativos: string[];
  recomendaciones:    string[];
  modo:               string;
}

@Injectable({ providedIn: 'root' })
export class PrediccionService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/prediccion`;

  analizar(datos: PrediccionInput) {
    return this.http.post<PrediccionResult>(this.url, datos);
  }

  getMias() {
    return this.http.get<any>(`${this.url}/mias`);
  }

  getById(id: string) {
    return this.http.get<any>(`${this.url}/${id}`);
  }
}