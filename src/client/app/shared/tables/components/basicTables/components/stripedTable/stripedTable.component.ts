import {Component} from '@angular/core';

import {BasicTableService} from '../../basic-table.service';

@Component({
  selector: 'shared-striped-table',
  templateUrl: './stripedTable.html'
})
export class StripedTableComponent {

  smartTableData:Array<any>;

  constructor(private _basicTablesService: BasicTableService) {
    this.smartTableData = _basicTablesService.smartTableData;
  }
}
