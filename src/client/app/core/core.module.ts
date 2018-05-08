import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ModalModule } from './modal/modal.module';
import { throwIfAlreadyLoaded } from './module-import-check';
import { HeaderInterceptor } from './header.interceptor';
import { ToastService, ExceptionService } from './';
import { ArticleService } from './model/article.service';
import { AuthService } from './auth.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ModalModule
  ],
  exports: [
    NavbarComponent,
    ModalModule
  ],
  declarations: [NavbarComponent],
  providers: [
    ExceptionService,
    ToastService,
    ArticleService,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  ]
})
export class CoreModule { }
