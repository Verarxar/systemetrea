import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';

@NgModule({
  imports: [
    ArticlesRoutingModule,
    SharedModule
  ],
  providers: [],
  declarations: [ArticlesComponent, ArticleListComponent, ArticleDetailComponent]
})
export class ArticlesModule { }
