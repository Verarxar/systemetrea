import {Component} from '@angular/core';

import {BasicTableService} from '../../basic-table.service';

@Component({
  selector: 'shared-condensed-table',
  templateUrl: './condensedTable.html'
})
export class CondensedTableComponent {

  peopleTableData:Array<any>;

  constructor(private _basicTablesService: BasicTableService) {
    this.peopleTableData = _basicTablesService.peopleTableData;
  }
}
