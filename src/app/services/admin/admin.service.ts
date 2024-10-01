import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Admin } from '../../interfaces/admin';




@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://aat1.clinica.jpavancestecnologicos.com/api/admin';

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

  getAdmins(): Observable<Admin[]> {
  const headers = new HttpHeaders({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  return this.http.get<Admin[]>(this.apiUrl, { headers }) // Aquí incluimos los headers
    .pipe(
      retry(2), // Reintenta 2 veces si ocurre un error
      catchError(this.handleError) // Maneja errores
    ); 
  }

  createAdmin(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(this.apiUrl, JSON.stringify(admin), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateAdmin(admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.apiUrl}/${admin.id}`, JSON.stringify(admin), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteAdmin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}