import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CountdownComponent } from './countdown/countdown.component';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    NgxChartsModule
  ],
  exports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    NgxChartsModule,
    CountdownComponent
  ],
  declarations: [CountdownComponent]
})
export class SharedModule { }
