import { Injectable } from '@angular/core';
import { Article } from './article';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
const api = '/api';

@Injectable()
export class ArticleService {
  constructor(private http: Http) {}

  getArticles() {
    return this.http.get(`${api}/articles`).toPromise().then((response) => {
         console.log(response);
         return response.json() as Article[];
     });
  }

  deleteArticle(article: Article) {
    return this.http.delete(`${api}/articles/${article.nr}`);
  }

  addArticle(article: Article) {
    return this.http.post(`${api}/articles/`, article);
  }

  updateArticle(article: Article) {
    return this.http.put(`${api}/articles/${article.nr}`, article);
  }
}
