import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Sala } from '../../interfaces/sala';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
private apiUrl = 'https://aat1.clinica.jpavancestecnologicos.com/api/sala';

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


getData(): Observable<Sala[]> {
  const headers = new HttpHeaders({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  return this.http.get<Sala[]>(this.apiUrl, { headers }) // Aquí incluimos los headers
    .pipe(
      retry(2), // Reintenta 2 veces si ocurre un error
      catchError(this.handleError) // Maneja errores
    );
}


  getById(id: number): Observable<Sala> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Sala>(url);
  }

  createData(data: Sala): Observable<Sala> {
    return this.http.post<Sala>(this.apiUrl, JSON.stringify(data), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateData(data: Sala): Observable<Sala> {
    return this.http.put<Sala>(`${this.apiUrl}/${data.id}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteData(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
