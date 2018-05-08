import { Injectable } from '@angular/core';
import { Article } from './';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, finalize, map } from 'rxjs/operators';

const api = '/api';

@Injectable()
export class ArticleService {

  constructor(private http: HttpClient) {}

  getArticles() {
    return this.http.get<Article[]>(`${api}/articles`);
  }
}
