import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CountdownComponent } from './countdown/countdown.component';
@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    NgxChartsModule,
    MomentModule
  ],
  exports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    NgxChartsModule,
    MomentModule,
    CountdownComponent
  ],
  declarations: [CountdownComponent]
})
export class SharedModule { }
