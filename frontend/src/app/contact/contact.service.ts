import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Contact } from './contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiURL = "http://localhost:3000/";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  /**
   * GET /contacts/
   */
  getAll(): Observable<Contact[]> {
    return this.httpClient.get<Contact[]>(this.apiURL + 'contacts/')
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * POST /contacts/
   * @param contact
   */
  create(contact): Observable<Contact> {
    return this.httpClient.post<Contact>(this.apiURL + 'contacts/', JSON.stringify(contact), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * GET /contacts/{id}
   * @param id
   */
  find(id): Observable<Contact> {
    return this.httpClient.get<Contact>(this.apiURL + 'contacts/' + id)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * PUT /contacts/{id}
   * @param id
   * @param contact
   */
  update(id, contact): Observable<Contact> {
    return this.httpClient.put<Contact>(this.apiURL + 'contacts/' + id, JSON.stringify(contact), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  /**
   * DELETE /contacts/{id}
   * @param id
   */
  delete(id) {
    return this.httpClient.delete<Contact>(this.apiURL + 'contacts/' + id, this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.message;
    }
    return throwError(errorMessage);
  }
}
