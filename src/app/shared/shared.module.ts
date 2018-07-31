import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CountdownComponent } from './countdown/countdown.component';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    StarRatingModule.forRoot(),
    FormsModule
  ],
  exports: [
    CommonModule,
    NgSelectModule,
    StarRatingModule,
    FormsModule,
    CountdownComponent
  ],
  declarations: [CountdownComponent]
})
export class SharedModule { }
