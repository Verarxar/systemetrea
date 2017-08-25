import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './articles.routing';
import { ArticlesComponent } from './articles.component';
import { ArticleService } from './article.service';
import { DataFilterPipe } from './data-filter.pipe';
import { DataTableModule } from 'angular2-datatable';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    DataTableModule
  ],
  providers: [ ArticleService ],
  declarations: [
    ArticlesComponent, DataFilterPipe
  ]
})
export class ArticlesModule {
}
