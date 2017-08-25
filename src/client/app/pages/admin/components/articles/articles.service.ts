import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const api = '/api/admin';

@Injectable()
export class ArticlesService {

  constructor(private http: Http) {}

  getArticlesCount() {
    return this.http.get(`${api}/articles/count`).toPromise().then((response) => {
         return response.json();
     }).catch((error) => {
       console.error("err fetching new XML: ", error);
       return "bug lol";
     });
  }

  compareArticles(files) {
    return this.http.post(`${api}/articles`, {files: files}).toPromise().then((response) => {
      return response.json()[0];
    });
  }

  dropDB() {
    return this.http.delete(`${api}/articles`, {}).toPromise().then((response) => {
         console.log("kiled lol", response);
         return response.json();
     }).catch((error) => {
       console.error("err fetching new XML: ", error);
       return "bug lol";
     });
  }

  insertArticles(fileName: string) {
    return this.http.post(`${api}/articles/${fileName}`, {}).toPromise().then((response) => {
         return response.json();
     }).catch((error) => {
       console.error("err fetching new XML: ", error);
       return "bug lol";
     });
  }

}
