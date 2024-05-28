import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ubicacion } from '../models/ubicacion.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  private url = 'http://127.0.0.1:8000/api/ubicacion';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // Obtener todas las ubicaciones
  getUbicaciones(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.url);
  }


}
