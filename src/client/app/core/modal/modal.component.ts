import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ModalService } from './modal.service';


declare var UIkit: any;

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.less']
})

export class ModalComponent implements OnInit {
    modal: any;
    text: string;
    rejectModal: any;
    resolveModal: any;
    error: string;

    constructor(private modalService: ModalService) {
      modalService.activate = this.activate.bind(this);
    }

    ngOnInit() {
    }

    activate(data: any): Promise<string> {
      this.text = data;
      this.modal = UIkit.modal('#preview-modal', {
        modal: false,
        keyboard: false,
        bgClose: false,
        escClose: false,
        container: false,
        center: true });
      const promise = new Promise<any>((resolve, reject) => {
          this.rejectModal = (e: any) => {
            this.modal.hide();
            reject('Modal\'s Cancel was clicked');
          };
          this.resolveModal = (e: any) => {
            this.modal.hide();
            resolve('Modal\'s OK was clicked');
          };

          this.show();
      });
      return promise;
    }

    saveClick(event?: any) {
      if (event) {
        event.stopPropagation();
      }
      this.handleSuccess();
    }

    cancelClick(event?: any) {
      if (event) {
        event.stopPropagation();
      }
      this.handleError();
    }

    handleError() {
      this.clearModalData();
      this.rejectModal();
    }

    handleSuccess() {
      this.clearModalData();
      this.resolveModal();
    }

    clearModalData() {
      this.text = '';
      this.error = '';
    }

    show() {
        this.modal.show();
    }
}
