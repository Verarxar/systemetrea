import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Article, ReducedResponse } from './models';

const api = 'http://systemetrea.eu/api';

@Injectable({ providedIn: 'root' })
export class ArticleService {

  constructor(private http: HttpClient) { }

  getArticles(): Observable<ReducedResponse[]> {
    return this.http
      .get<ReducedResponse[]>(`${api}/articles`)
      .pipe(
        map(article => article),
        catchError(this.handleError)
      );
  }

  private handleError(res: HttpErrorResponse) {
    console.error(res.error);
    return observableThrowError(res.error || 'Server error');
  }
}