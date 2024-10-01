import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Paciente } from '../../interfaces/paciente';


@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'https://aat1.clinica.jpavancestecnologicos.com/api/paciente';

  constructor(private http: HttpClient) { }

  // Headers
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  // Error handling
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getPacientes(): Observable<Paciente[]> {
  const headers = new HttpHeaders({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  return this.http.get<Paciente[]>(this.apiUrl, { headers }) // Aquí incluimos los headers
    .pipe(
      retry(2), // Reintenta 2 veces si ocurre un error
      catchError(this.handleError) // Maneja errores
    ); 
  }

  getPaciente(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  createPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, JSON.stringify(paciente), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updatePaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/${paciente.id}`, JSON.stringify(paciente), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deletePaciente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}