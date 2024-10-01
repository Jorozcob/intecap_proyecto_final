import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { User } from '../../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 private apiUrl = 'https://aat1.clinica.jpavancestecnologicos.com/api/usuario';

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

  getUsers(): Observable<User[]> {
   const headers = new HttpHeaders({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  return this.http.get<User[]>(this.apiUrl, { headers }) // Aquí incluimos los headers
    .pipe(
      retry(2), // Reintenta 2 veces si ocurre un error
      catchError(this.handleError) // Maneja errores
    ); 
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  createUser(data: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, JSON.stringify(data), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUser(data: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${data.id}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  } 
}
