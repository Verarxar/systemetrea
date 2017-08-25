import { Component, OnInit } from '@angular/core';
import { ArticlesService } from './';
import { TreeModel } from 'ng2-tree';
import { XmlService } from '../xml.service';
//import * as Handsontable from 'handsontable/dist/handsontable.full.js';
class ReducedStatistics {
    articleCount: Number;
    reducedCount: Number;
    apiFileDate: String;
    articles: Array<any>;
}

class ArticlesData {
  articleCount: Number;
  reducedCount: Number;
  lastChecked: String;
  articlesPerDate: Array<any>;
  reducedPerDate: Array<any>;
  constructor() {
    this.articleCount = 0;
    this.reducedCount = 0;
    this.lastChecked = "";
    this.articlesPerDate = [];
    this.reducedPerDate = [];
  }
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.html',
  styleUrls: ['./articles.scss']
})
export class ArticlesComponent implements OnInit {
  articlesData: ArticlesData = new ArticlesData();
  stats: ReducedStatistics;
  isBusy: boolean = true;
  initiated: boolean = false;
  files = [];
  tree: TreeModel;
  status;
  selectedFile;

  afterChange(e: any) {
    console.log(e);
  }

  afterOnCellMouseDown(e: any) {
    console.log(e);
  }  
  constructor(private service: ArticlesService, private xmlService: XmlService) {

  }

  ngOnInit() {
    this.init();
    
  }

  init() {
    this.xmlService.getXmlFiles().then(response => {
      this.files = response;
      this.initiated = true;
      this.getArticlesCount();
    });
  }

  insertArticles(fileName: string) {
    this.isBusy = true;
    console.log("selectedFile: ", this.selectedFile);
    this.selectedFile.hasBeenRun = true;
    this.service.insertArticles(this.selectedFile.name).then().then(response => {
      console.log("response from that yeah? ", response);
      this.articlesData.reducedCount = 0;
      this.articlesData.articleCount = response.total;
      this.articlesData.lastChecked = response.apiFileDate;
      this.getArticlesCount();
    }).catch(this.handleError);
  }

  getArticlesCount() {
    this.service.getArticlesCount().then(response => {
      this.setTreeContent(this.articlesData);
      if(response.length > 0) {
        console.log("articleCount. ", response);
        this.prepareArticlesData(response);
      }
    }).catch(this.handleError);
  }

  compareArticles() {
    this.isBusy = true;
    let fileNames = [];

    this.selectedFile.forEach((obj) => {
      obj.hasBeenRun = true;
      fileNames.push(obj.name);
    });
    this.service.compareArticles(fileNames).then((res) => {
      this.isBusy = false;
      console.log("compareArticles done: ", res);
    });
  }

  dropDB() {
    this.service.dropDB().then((response:any) => {
      console.log("response: ", response);
      this.nullArticlesData();
      this.files = response;
    }).catch(this.handleError);
  }

  prepareArticlesData(data) {
    var dataArray = [];
    this.articlesData = {
      articleCount: data[0].articleCount,
      reducedCount: 0,
      lastChecked: data[0].apiFileDate,
      articlesPerDate: [],
      reducedPerDate: []
    };
    data.forEach((obj) => {
      var articlePerDate = {
        value: obj.articleCount,
        date: obj.apiFileDate
      };
      var reducedPerDate = {
        value: obj.reducedCount,
        date: obj.apiFileDate
      };      
      this.articlesData.reducedCount += obj.reducedCount;
      this.articlesData.articlesPerDate.push(articlePerDate);
      this.articlesData.reducedPerDate.push(reducedPerDate)
    });
    this.files.forEach((file) => {
      this.articlesData.articlesPerDate.forEach((stats) => {
        if(stats.date === file.date) {
          file.hasBeenRun = true;
        }
      });
    });
    console.log("files: ", this.files);
    this.isBusy = false;
  }

  nullArticlesData() {
    this.articlesData.reducedCount = 0;
    this.articlesData.articleCount = 0;
    this.articlesData.lastChecked = null;
  }
  setTreeContent(content) {
    console.log("content: ", content);
    this.tree = {
      value: "Database status",
      children: [
        {
          value: 'Last updates: ' + content.apiFileDate || "",
          children: [
            {value: 'Total number of articles: ' + (content.articleCount || 0)},
            {value: 'Number of articles reduced in price: ' + (content.reducedCount || 0)},
            {value: 'Articles tagged with warning: 0'}
          ]
        },
        {
          value: 'Users',
          children: [
            {value: 'sadfsdf'},
            {value: 's3434'},
            {value: 'Luaggggggg'}
          ]
        }
      ]
    };
  }

  handleError(err) {

    console.log("@xml.component err:", err);
  }
}
