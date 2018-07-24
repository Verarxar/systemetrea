import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { Article, ReducedResponse } from '../../core/models';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.less']
})
export class ArticleListComponent implements OnInit {
  @Input() articles: Article[];
  @Input() filteringDate: string;
  @Output() selected = new EventEmitter<Article>();
  filteringTime;

  ngOnInit() {
    this.filteringTime = new Date(this.filteringDate).getTime();
  }

  byId(article: Article) {
    return article.nr;
  }

  isSoldOut(lastModified: string) {
    const articleTime = new Date(lastModified).getTime();
    return articleTime < this.filteringTime;
  }

  onSelect(article: Article) {
    this.selected.emit(article);
  }
}
