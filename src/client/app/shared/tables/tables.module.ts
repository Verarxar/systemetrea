import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTableModule } from "angular2-datatable";
import { HttpModule } from "@angular/http";
import { DataFilterPipe } from './components/dataTables/data-filter.pipe';


import { BasicTableComponent } from './components/basicTables/basic-table.component';
import { ResponsiveTableComponent } from './components/basicTables/components/responsiveTable';
import { StripedTableComponent } from './components/basicTables/components/stripedTable';
import { BorderedTableComponent } from './components/basicTables/components/borderedTable';
import { HoverTableComponent } from './components/basicTables/components/hoverTable';
import { CondensedTableComponent } from './components/basicTables/components/condensedTable';
import { ContextualTableComponent } from './components/basicTables/components/contextualTable';
import { SmartTableComponent } from './components/smartTables/smart-table.component';
import { DataTableComponent } from './components/dataTables/data-table.component';

import { BasicTableService } from './components/basicTables/basic-table.service';
import { DataTableService } from './components/dataTables/data-table.service';
import { SmartTableService } from './components/smartTables/smart-table.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    Ng2SmartTableModule,
    DataTableModule,
    HttpModule
  ],
  declarations: [
    BasicTableComponent,
    ResponsiveTableComponent,
    StripedTableComponent,
    BorderedTableComponent,
    HoverTableComponent,
    CondensedTableComponent,
    ContextualTableComponent,
    SmartTableComponent,
    DataTableComponent,
    DataFilterPipe
  ],
  providers: [
    BasicTableService,
    SmartTableService,
    DataTableService
  ],
  exports: [
    BasicTableComponent,
    ResponsiveTableComponent,
    StripedTableComponent,
    BorderedTableComponent,
    HoverTableComponent,
    CondensedTableComponent,
    ContextualTableComponent,
    SmartTableComponent,
    DataTableComponent
  ]
})
export class TablesModule {
}
