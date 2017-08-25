import { Component, OnInit, Input } from '@angular/core';

import {LineMapService} from './line-map.service';

@Component({
  selector: 'shared-line-map',
  templateUrl: './line-map.html',
  styleUrls: ['./line-map.scss']
})
export class LineMapComponent implements OnInit {
  @Input() coordinates: any;
  isReady: boolean = false;
  chartData:Object;

  constructor(private _lineMapsService:LineMapService) {
    
  }

  ngOnInit() {
    this.isReady = true;
    this.chartData = this._lineMapsService.getData(this.coordinates);
    console.log("chartData: ", this.chartData);
  }
}
