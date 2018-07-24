import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeSe from '@angular/common/locales/sv';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';

import { FaqComponent } from './faq/faq.component';

registerLocaleData(localeSe, 'sv');

@NgModule({
  declarations: [
    AppComponent,
    FaqComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    AppRoutingModule,
    LoginModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
