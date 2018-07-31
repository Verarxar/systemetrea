import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../modal.service';
import { Article } from '../../../core/models';
import {
  ClickEvent,
  HoverRatingChangeEvent,
  RatingChangeEvent
} from 'angular-star-rating';
declare var UIkit: any;

@Component({
    selector: 'app-article-modal',
    templateUrl: './article-modal.component.html',
    styleUrls: ['./article-modal.component.less']
})

export class ArticleModalComponent implements OnInit, OnDestroy {
    modal: any;
    article: Article;
    visible: boolean;
    cancelClick: any;
    confirmClick: any;

    constructor(private modalService: ModalService) {
      this.modalService.activateArticleModal = this.activate.bind(this);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
      this.visible = false;
    }

    activate(article: Article) {
      this.article = article;
      this.modal = UIkit.modal('#article-modal', {
        modal: false,
        keyboard: true,
        bgClose: true,
        container: false,
        center: true
      });
      UIkit.util.on('#article-modal', 'beforehide', () => {
        this.cancelClick();
      });
      const promise = new Promise<any>((resolve, reject) => {
          this.cancelClick = (e: any) => {
            resolve();
          }
          this.confirmClick = (e: any) => {
            resolve();
          }
          this.modal.show();
          this.visible = true;
      });
      return promise;
    }

    onRatingChange($event: RatingChangeEvent) {
      console.log('onRatingUpdated $event: ', $event);
      // send to api ...
    }

    onCloseEvent(event?: any) {
      this.restoreModal();
      this.cancelClick();
    }

    onConfirmEvent(event?: any) {
      this.confirmClick();
      this.restoreModal();
    }

    show() {
      this.modal.show();
    }

    restoreModal() {
      this.modal.hide();
      this.visible = false;
    }

}
