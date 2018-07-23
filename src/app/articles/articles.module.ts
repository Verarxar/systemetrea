import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles.component';
import { ArticleListComponent } from './article-list/article-list.component';

@NgModule({
  imports: [
    ArticlesRoutingModule,
    SharedModule
  ],
  providers: [],
  declarations: [ArticlesComponent, ArticleListComponent]
})
export class ArticlesModule { }
