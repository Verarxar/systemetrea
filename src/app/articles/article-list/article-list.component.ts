import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Article } from '../../core/models';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.less']
})
export class ArticleListComponent implements OnInit {
  @Input() articles: Article[];
  @Input() filteringDate: string;
  @Input() isBusy: boolean;
  @Input() filteringVarugrupp: string;
  filteringTime;
  constructor() {}

  ngOnInit() {
    this.filteringTime = new Date(this.filteringDate).getTime();
  }

  byId(article: Article) {
    return article.nr;
  }

  checkBusy(event) {
    if (this.isBusy) {
      console.log('isBusy');
      event.stopPropagation();
    }
  }

  isSoldOut(lastModified: string) {
    const articleTime = new Date(lastModified).getTime();
    return articleTime < this.filteringTime;
  }
}
