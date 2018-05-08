import { Injectable } from '@angular/core';
declare const UIkit: any;

@Injectable()
export class ToastService {
  options: any;

  constructor() {
    this.options = {
      message: '',
      icon: '',
      status: 'success',
      pos: 'top-center',
      timeout: 15000
    };
  }

  private message(message: string) {
    this.options.message = message;
    console.log(this.options.status);
    UIkit.notification(this.options);
  }

  error(message: string) {
    this.options.status = 'danger';
    this.message(message);
  }

  success(message: string) {
    this.options.status = 'success';
    this.message(message);
  }

  warning(message: string) {
    this.options.status = 'warning';
    this.message(message);
  }
}
