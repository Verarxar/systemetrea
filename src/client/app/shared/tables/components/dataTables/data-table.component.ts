import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataTableService } from './data-table.service';


@Component({
  selector: 'shared-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
    @Input() options;
    @Output() change: EventEmitter<string> = new EventEmitter();
    defaultSettings = { filter: false, dropdowns: false, title: '' };
    data = [];
    filterQuery = "";
    rowsOnPage = 10;
    sortBy = "email";
    sortOrder = "asc";

    constructor(private service: DataTableService) {
      // this.service.getData().then((data) => {
      //   console.log("structure of table data: ", data);
      // });
    }

    ngOnInit() {
      this.data = this.options.data;
      this.setDefaultOptions();
    }

    remove(name: string) {
      this.change.emit(name);
      for(var i = 0; i < this.options.data.length; i++) {
        if(this.options.data[i].name === name) {
          this.options.data.splice(i, 1);
        }
      }      
    }

    toInt(num: string) {
        return +num;
    }

    setDefaultOptions() {
      for(var key in this.defaultSettings) {
        if(!this.options[key]) {
          this.options[key] = this.defaultSettings[key];
        }
      }
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }

}
