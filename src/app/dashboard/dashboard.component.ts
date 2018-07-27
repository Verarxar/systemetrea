import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleService } from '../core/article.service';
import { Chart } from 'chart.js';

class Statistics {
  articlesCount: number;
  groupCount: any[];
  reducedCount: number;
  totalCostReduced: number;
  bubbleChart;

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
  chart = [];
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
    this.chart = this.getBubbleChartSettings();
    this.articleService.getStatistics().subscribe((stats: Statistics) => {
      this.statistics.groupCount = stats.groupCount;
      this.statistics.articlesCount = stats.articlesCount;
      this.statistics.reducedCount = stats.reducedCount;
      this.statistics.totalCostReduced = stats.totalCostReduced;
    });
  }

  getBubbleChartSettings() {
    return new Chart('bubble-chart', {
      type: 'bubble',
      data: {
        labels: 'this is a label',
        datasets: [
          {
            label: ['vin'],
            backgroundColor: 'rgba(255,221,50,0.2)',
            borderColor: 'rgba(255,221,50,1)',
            data: [
              {
                x: 280,
                y: 5.245,
                r: 35
              }
            ],
          },
          {
            label: ['sprit'],
            backgroundColor: 'rgba(60,186,159,0.2)',
            borderColor: 'rgba(60,186,159,1)',
            data: [{
              x: 300,
              y: 7.526,
              r: 10
            }]
          },
          {
            label: ['öl'],
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderColor: '#000',
            data: [{
              x: 290,
              y: 6.994,
              r: 15
            }]
          }
        ],
      },
      options: {
        title: {
          display: true,
          text: 'prissänking per typ'
        }, scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'ett pris'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'ett annat pris'
            }
          }]
        }
      }
    });
  }

  getAnimationSettings() {
    const show = localStorage.getItem('intro');
    return !show;
  }
}

