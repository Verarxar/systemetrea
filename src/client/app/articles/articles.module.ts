import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesRoutingModule, routedComponents } from './articles-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    SharedModule
  ],
  declarations: [routedComponents]
})
export class ArticlesModule { }
