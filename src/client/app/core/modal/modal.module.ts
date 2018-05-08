import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from '../module-import-check';
import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [ModalComponent],
  declarations: [ModalComponent],
  providers: [ModalService]
})
export class ModalModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: ModalModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'ModalModule');
  }
}
