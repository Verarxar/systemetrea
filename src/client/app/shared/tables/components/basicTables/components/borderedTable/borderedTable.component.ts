import {Component} from '@angular/core';

import {BasicTableService} from '../../basic-table.service';

@Component({
  selector: 'shared-bordered-table',
  templateUrl: './borderedTable.html',
})
export class BorderedTableComponent {

  metricsTableData:Array<any>;

  constructor(private _basicTablesService: BasicTableService) {
    this.metricsTableData = _basicTablesService.metricsTableData;
  }
}