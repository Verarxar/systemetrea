import { Component, OnInit } from '@angular/core';
import { Article } from './article';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-editors',
  templateUrl: `./articles.html`,
  styleUrls: ['./article.component.scss']
})
export class ArticlesComponent implements OnInit {
  data: any = [];
  selectedArticle: Article;
  filterQuery = '';
  rowsOnPage = 10;
  sortBy = 'email';
  sortOrder = 'asc';

  constructor(private articleService: ArticleService) {
  }

  ngOnInit() {
    this.getArticles();
  }

  getArticles() {
    return this.articleService.getArticles().then(articles => {
      this.data = articles;
      console.log('this.articles: ', this.data);
    });
  }

  toInt(num: string) {
      return +num;
  }

  sortByWordLength = (a: any) => {
      return a.city.length;
  }

}
