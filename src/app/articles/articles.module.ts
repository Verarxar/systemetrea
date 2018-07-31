import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ModalModule } from './modal/modal.module';
import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles.component';
import { ArticleListComponent } from './article-list/article-list.component';
// import { ArticleDetailComponent } from './article-detail/article-detail.component';

@NgModule({
  imports: [
    ArticlesRoutingModule,
    ModalModule,
    SharedModule
  ],
  providers: [],
  declarations: [ArticlesComponent, ArticleListComponent]
})
export class ArticlesModule { }
