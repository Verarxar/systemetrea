import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError as observableThrowError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Article, ReducedResponse } from './models';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  apiBase: string;

  constructor(private http: HttpClient) {
    this.apiBase = environment.apiBase;
  }

  getArticles(params): Observable<ReducedResponse[]> {
    return this.http
      .get<ReducedResponse[]>(`${this.apiBase}/api/articles`, { params: params })
      .pipe(
        map(article => article),
        catchError(this.handleError)
      );
  }

  getArticle(id: number): Observable<Article> {
    return this.http
      .get<Article>(`${this.apiBase}/api/articles/${id}`);
  }

  getReducedDates() {
    return this.http
      .get<Article>(`${this.apiBase}/api/reduced/dates`);
  }

  getStatistics() {
    console.log('this.apiBase: ', this.apiBase);
    return this.http.get(`${this.apiBase}/api/articles/statistics`);
  }

  private handleError(res: HttpErrorResponse) {
    console.error(res.error);
    return observableThrowError(res.error || 'Server error');
  }
}
