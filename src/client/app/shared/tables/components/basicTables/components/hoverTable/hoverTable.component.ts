import {Component} from '@angular/core';

import {BasicTableService} from '../../basic-table.service';

@Component({
  selector: 'shared-hover-table',
  templateUrl: './hoverTable.html'
})
export class HoverTableComponent {

  metricsTableData:Array<any>;

  constructor(private _basicTablesService: BasicTableService) {
    this.metricsTableData = _basicTablesService.metricsTableData;
  }
}
