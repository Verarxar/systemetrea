import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { formatDate } from '@angular/common';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { Article, ArticleTypeCount } from '../core/models';
import { ArticleService } from '../core/article.service';
import { SpinnerService } from '../core/spinner/spinner.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { ModalService } from './modal/modal.service';

class Filters {
  date: string;
  type: string;
  constructor (date) {
    this.date = date;
    this.type = null;
  }
}

class Params {
  date: string;
  reduced?: boolean;
  limit?: number;
  offset?: number;
  varugrupp?: string;

  constructor() {
    this.limit = 50;
    this.offset = 0;
    this.reduced = true;
  }
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.less']
})
export class ArticlesComponent implements OnInit {
  articles: Article[];
  filters: Filters;
  params: Params;
  id: number;
  hasMore: boolean;
  dates: any;
  isBusy: boolean;
  selectedDate: any;
  lastUpdatedDate: Date;
  categories: ArticleTypeCount;
  articles$: Observable<Article[]>;
  subscription: Subscription;

  constructor(
    private articleService: ArticleService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.hasMore = true;
    this.params = new Params();
    this.isBusy = false;
    this.dates = [];
  }

  ngOnInit() {
    this.articleService.getReducedDates().subscribe((dates) => {
      this.dates = dates;
      this.selectedDate = dates[0];
      this.activatedRoute.queryParams.pipe(map(qp => {
        const filters = {
          varugrupp: qp['varugrupp'],
          date: qp['datum'],
          id: qp['id']
        };
        return filters;
      })).subscribe((filters) => {
        this.params.date = filters.date || this.selectedDate.date;
        this.id = filters.id;
        this.filters = new Filters(this.params.date);
        this.filters.type = filters.varugrupp || null;
        if (this.filters.type) {
          this.params.varugrupp = this.filters.type;
        }
        this.lastUpdatedDate = this.selectedDate.date;
        if (this.id) {
          this.articleService.getArticle(this.id).subscribe((article) => {
            this.openModal(article);
          });
        }
        this.getArticles();
      });
    });
  }

  getArticles() {
    if (this.isBusy) return;
    this.isBusy = true;
    this.params.offset = 0;
    if (!this.filters.type) {
      delete this.params.varugrupp;
    }
    this.articleService.getArticles(this.params).subscribe((res: any) => {
      this.articles = res.articles;
      this.hasMore = res.count > this.articles.length && res.articles.length === this.params.limit;
      this.categories = res.typeStatistics;
      this.isBusy = false;
    });
  }

  openModal(article: Article) {
    this.isBusy = true;
    this.modalService.activateArticleModal(article).then(() => {
      // const qp = getCurrentParams();
      this.router.navigate(['/articles'], { queryParams: { varugrupp: this.filters.type } });
    }).catch((err) => {
      console.log('modal also closed.');
    })
  }

  onTypeChange(type: string) {
    if (this.isBusy) return;
    this.filters.type = type ? type.toLowerCase() : null;
    this.router.navigate(['/articles'], { queryParams: { varugrupp: this.filters.type } });
    this.params.varugrupp = this.filters.type;
    this.getArticles();
  }

  onDateChange(event) {
    this.articles = [];
    this.params.date = this.filters.date = this.selectedDate.date;
    this.getArticles();
  }

  transformDate(date) {
    return formatDate(new Date(date), 'mediumDate', 'sv');
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    if (!this.isBusy && this.hasMore) {
      const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.clientHeight;
      const endreached = document.documentElement.scrollHeight;
      if (pos >= (endreached - 200)) {
        this.params.offset = this.params.offset + this.params.limit;
        this.isBusy = true;
        this.articleService.getArticles(this.params).subscribe((res: any) => {
          console.log('res', res);
          this.articles = this.articles.concat(res.articles);
          this.hasMore = res.count > this.articles.length && res.articles.length === this.params.limit;
          this.isBusy = false;
        });
      }
    }
  }
}
