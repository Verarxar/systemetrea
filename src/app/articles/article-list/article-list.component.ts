import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { Article, ReducedResponse } from '../../core/models';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.less']
})
export class ArticleListComponent implements OnInit {
  @Input() articles: Article[];
  @Input() selectedArticle: Article;
  @Output() selected = new EventEmitter<Article>();

  ngOnInit() {
    console.log('articles in list: ', this.articles);
  }

  byId(article: Article) {
    return article.nr;
  }

  onSelect(article: Article) {
    this.selected.emit(article);
  }
}
