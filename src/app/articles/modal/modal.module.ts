import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleModalComponent } from './article-modal/article-modal.component';
import { ModalService } from './modal.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [ArticleModalComponent],
  declarations: [ArticleModalComponent],
  providers: [ModalService]
})
export class ModalModule {}
