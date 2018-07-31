import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Article } from '../core/models/article';
import { ArticleService } from '../core/article.service';

@Injectable({ providedIn: 'root' })
export class ArticleResolver implements Resolve<Article> {
  constructor(private articleService: ArticleService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const id = +route.params['id'];
    const id = +route.paramMap.get('id');
    return this.articleService.getArticle(id).pipe(article => article,
      catchError((error: any) => {
        return of(null);
      })
    );
  }
}
