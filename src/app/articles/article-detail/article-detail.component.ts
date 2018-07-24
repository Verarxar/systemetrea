import { Component, OnInit } from '@angular/core';
import { Article } from '../../core/models/article';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.less']
})
export class ArticleDetailComponent implements OnInit {
  article: Article;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { article: Article }) => {
      this.article = data.article;
      console.log('article', this.article);
    });
  }

}
