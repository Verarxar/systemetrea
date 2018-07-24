import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { formatDate } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { Article, ReducedResponse } from '../core/models';
import { ArticleService } from '../core/article.service';
import { SpinnerService } from '../core/spinner/spinner.service';

declare var UIkit: any;

class Params {
  date: string;
  limit?: number;
  offset?: number;
  constructor() {
    this.limit = 50;
    this.offset = 0;
  }
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.less']
})
export class ArticlesComponent implements OnInit {
  articles: Article[];
  params: Params;
  dates: any;
  isBusy: boolean;
  selectedDate: any;
  articlesData: any;
  articles$: Observable<Article[]>;
  subscription: Subscription;

  constructor(private articleService: ArticleService, private spinnerService: SpinnerService) {
    this.params = new Params();
    this.dates = [];
  }

  ngOnInit() {
    this.isBusy = true;
    this.articleService.getReducedDates().subscribe((dates) => {
      console.log('dates', dates);
      this.dates = dates;
      this.selectedDate = dates[0];
      this.getArticles(this.selectedDate.date);
    });
  }

  getArticles(date?: string) {
    if (date) {
      this.params.date = date;
    }
    this.isBusy = true;
    this.articleService.getArticles(this.params).subscribe((res: any) => {
      this.articles = res.articles;
      this.populateStatistics(this.articles);
      console.log('articles', this.articles);
      this.isBusy = false;
    });
  }

  onChange(event) {
    this.articles = [];
    this.articlesData = null;
    this.getArticles(this.selectedDate.date);
  }

  getTypeCount(articles) {
    const category = {};
    articles.forEach(o => {
      category[o.varugrupp] = category[o.varugrupp] ? category[o.varugrupp] + 1 : 1;
    });
    const response = [];
    for (const key of Object.keys(category)) {
      response.push(
        { name: key, count: category[key] }
      );
    }
    response.sort(function (a, b) {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return response;
  }

  populateStatistics(articles: Array<Article>) {
    this.articlesData = {
      date: this.selectedDate.date,
      count: this.selectedDate.count,
      categories: this.getTypeCount(articles)
    };
  }

  transformDate(date) {
    return formatDate(new Date(date), 'mediumDate', 'sv');
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    if (!this.isBusy) {
      const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.clientHeight;
      const endreached = document.documentElement.scrollHeight;
      if (pos >= (endreached - 200)) {
        this.params.offset = this.params.offset + this.params.limit;
        this.isBusy = true;
        this.articleService.getArticles(this.params).subscribe((res: any) => {
          console.log('res', res);
          this.articles = this.articles.concat(res.articles);
          this.isBusy = false;
        });
      }
    }
  }
}
