import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticlesComponent } from './articles.component';
import { ArticleResolver } from './article-detail-resolver.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ArticlesComponent
  },
  {
    path: ':id',
    pathMatch: 'full',
    component: ArticlesComponent,
    resolve: {
      article: ArticleResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ArticlesRoutingModule { }

