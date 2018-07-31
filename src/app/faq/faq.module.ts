import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FaqComponent } from './faq.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule
  ],
  declarations: [FaqComponent]
})
export class FaqModule { }
