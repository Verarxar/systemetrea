import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArticleService } from '../core/article.service';
import { Chart } from 'chart.js';
import { Article } from '../core/models';

class Statistics {
  articles: Article[];
  count: number;
  type: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  loading = false;
  statistics: Statistics[];
  view: any[] = [1200, 350];
  selectedGroup: Statistics;
  chartOptions: any;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  show: boolean;

  constructor(private http: HttpClient, private articleService: ArticleService) {
    this.show = true;
  }

  ngOnInit() {
    this.articleService.getStatistics().subscribe((statstics: Statistics[]) => {
      this.statistics = statstics;
      this.selectedGroup = this.statistics[0];
      this.chartOptions = this.getBubbleChartSettings();
    });
  }

  onFilterChange(value: string) {
    const str = value.split('-')[0];
    console.log('str', str);
    this.loading = true;
    this.chartOptions.data.datasets = [];
    this.selectedGroup = this.statistics.find((obj: any) => {
      return obj.type === str;
    });

    this.loading = false;
    this.chartOptions = this.getBubbleChartSettings();
    // this.chartOptions.data.labels = filter.type;
    // this.chartOptions.data.datasets = filter.articles;
  }

  getBubbleChartSettings() {
    const datasets = this.selectedGroup.articles;
    return new Chart('bubble-chart', {
      type: 'bubble',
      data: {
        labels: `${this.selectedGroup.type}`,
        datasets: datasets,
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
}
