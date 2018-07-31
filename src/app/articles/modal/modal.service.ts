import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
  /**
   * opening a modal returns a promise. Usage: this.modalService.activateArticleModal().then()...catch()...
   */
  activateArticleModal: (config?: any) => Promise<any>;
}
