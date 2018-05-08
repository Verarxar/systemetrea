import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitCapsPipe } from './init-caps.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { FontAwesomeComponent } from './font-awesome/font-awesome.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    InitCapsPipe,
    SafeHtmlPipe,
    FontAwesomeComponent
  ],
  declarations: [
    InitCapsPipe,
    SafeHtmlPipe,
    FontAwesomeComponent
  ]
})
export class SharedModule { }
