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
              label: ['Nubori Crianza Edición Limitada'],
              backgroundColor: 'rgba(255,221,50,0.2)',
              borderColor: 'rgba(255,221,50,1)',
              data: [
                {
                  x: 355,
                  y: 149,
                  r: 58
                }
              ],
            },
          {
            label: ['il Tre Fratelli Chianti'],
            backgroundColor: 'rgba(255,221,50,0.2)',
            borderColor: 'rgba(255,221,50,1)',
            data: [
              {
                x: 89,
                y: 59,
                r: 33.7
              }
            ],
          },
          {
            label: ['Campo Burgo Reserva'],
            backgroundColor: 'rgba(60,186,159,0.2)',
            borderColor: 'rgba(60,186,159,1)',
            data: [{
              x: 155,
              y: 105,
              r: 32.3
            }]
          },
          {
            label: ['Poggio Castelsus Rosso Toscano Organic'],
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderColor: '#000',
            data: [{
              x: 99,
              y: 69,
              r: 30.3
            }]
          }
        ],
      },
      options: {
        title: {
          display: true,
          text: 'Dags för realisation'
        }, scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Nytt pris'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Gammalt pris'
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
