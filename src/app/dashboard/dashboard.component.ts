import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleService } from '../core/article.service';

class Statistics {
  articlesCount: number;
  groupCount: any[];
  reducedCount: number;
  totalCostReduced: number;

  constructor() {
    this.groupCount = [];
    Object.assign(this, { reducedCount: 0, totalCostReduced: 0, articlesCount: 0 });
  }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  statistics: Statistics;
  view: any[] = [1200, 350];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  show: boolean;

  constructor(private http: HttpClient, private articleService: ArticleService) {
    this.show = true;
    this.statistics = new Statistics();
  }

  stopAnimation() {
    this.show = false;
    localStorage.setItem('intro', 'disable');
  }

  ngOnInit() {
    this.show = this.getAnimationSettings();

    this.articleService.getStatistics().subscribe((stats: Statistics) => {
      this.statistics.groupCount = stats.groupCount;
      this.statistics.articlesCount = stats.articlesCount;
      this.statistics.reducedCount = stats.reducedCount;
      this.statistics.totalCostReduced = stats.totalCostReduced;
    });
  }

  getAnimationSettings() {
    const show = localStorage.getItem('intro');
    return !show;
  }
}

