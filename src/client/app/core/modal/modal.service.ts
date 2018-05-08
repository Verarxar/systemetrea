import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
  activate: (data?: any) => Promise<boolean>;
}
