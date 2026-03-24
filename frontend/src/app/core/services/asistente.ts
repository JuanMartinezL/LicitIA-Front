import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface MensajeChat {
  role:    'user' | 'assistant';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class AsistenteService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/asistente`;

  chat(mensaje: string, historial: MensajeChat[] = []) {
    return this.http.post<any>(`${this.url}/chat`, { mensaje, historial });
  }

  analizarPliego(pliego: string, perfil_empresa?: any) {
    return this.http.post<any>(`${this.url}/analizar`, { pliego, perfil_empresa });
  }
}