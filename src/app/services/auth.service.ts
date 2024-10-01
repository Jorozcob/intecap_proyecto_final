import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://aat1.clinica.jpavancestecnologicos.com/api/usuario';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.usu_nombre === username && u.usu_pass === password);
        if (user) {
          // Autenticación exitosa
          return { success: true, user };
        } else {
          // Autenticación fallida
          throw new Error('Credenciales inválidas');
        }
      })
    );
  }
}