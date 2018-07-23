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
  selectedDate: any;
  articles$: Observable<Article[]>
  subscription: Subscription;

  constructor(private articleService: ArticleService, private spinnerService: SpinnerService) {
    this.dates = [];
  }

  ngOnInit() {
    this.getArticles();
  }

  getArticles() {
    this.spinnerService.show();
    this.articleService.getArticles().subscribe((res: ReducedResponse[]) => {
      this.populateDropDown(res);
      this.spinnerService.hide();
    });
  }

  onChange(event) {
    console.log('this.selectedDate', this.selectedDate);
    this.articles = this.selectedDate.articles;
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

  populateDropDown(reducedResponse: ReducedResponse[]) {
    reducedResponse.forEach((reduced, index) => {
      this.dates.push(
        {
          date: reduced.date,
          count: reduced.count,
          id: index,
          articles: reduced.articles,
          label: `${this.transformDate(reduced.date)} - (${reduced.count})`,
          categories: this.getTypeCount(reduced.articles)
        }
      );
      console.log('date pushed', this.dates[index]);
    });
    this.selectedDate = this.dates[0];
  }

  transformDate(date) {
    return formatDate(new Date(date), 'mediumDate', 'sv');
  }
}
