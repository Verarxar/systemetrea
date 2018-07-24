import { Component, OnInit, Inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Article, ReducedResponse } from '../core/models';
import { ArticleService } from '../core/article.service';
import { SpinnerService } from '../core/spinner/spinner.service';

declare var UIkit: any;

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.less']
})
export class ArticlesComponent implements OnInit {
  articles: Article[];
  dates: any;
  isBusy: boolean;
  selectedDate: any;
  articlesData: any;
  articles$: Observable<Article[]>
  subscription: Subscription;

  constructor(private articleService: ArticleService, private spinnerService: SpinnerService) {
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

  getArticles(date: string) {
    const params = { date: date };
    this.articleService.getArticles(params).subscribe((res: any) => {
      this.articles = res[0].articles;
      this.populateStatistics(this.articles);
      console.log('articles', this.articles);
      this.isBusy = false;
    });
  }

  onChange(event) {
    this.articles = [];
    this.articlesData = null;
    this.isBusy = true;
    this.getArticles(this.selectedDate.date);
  }

  getTypeCount(articles) {
    const category = {};
    articles.forEach(o => {
      category[o.varugrupp] = category[o.varugrupp] ? category[o.varugrupp]+1 : 1;
    });
    const response = [];
    for (let key in category) {
      response.push(
        { name: key, count: category[key] }
      );
    }
    response.sort(function(a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
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
}
