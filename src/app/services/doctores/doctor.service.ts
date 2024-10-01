
// doctor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, shareReplay, take, throwError } from 'rxjs';
import { Doctor } from '../../interfaces/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'https://aat1.clinica.jpavancestecnologicos.com/api/medico';

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


getDoctors(): Observable<Doctor[]> {
  const headers = new HttpHeaders({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  return this.http.get<Doctor[]>(this.apiUrl, { headers }) // Aquí incluimos los headers
    .pipe(
      retry(2), // Reintenta 2 veces si ocurre un error
      catchError(this.handleError) // Maneja errores
    );
}


  getDoctor(id: number): Observable<Doctor> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Doctor>(url);
  }

  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, JSON.stringify(doctor), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${doctor.id}`, JSON.stringify(doctor), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteDoctor(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}