import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../theme/nga.module';

// Maps
import { BubbleMaps } from './maps/components/bubbleMaps/bubbleMaps.component';
import { GoogleMaps } from './maps/components/googleMaps/googleMaps.component';
import { LeafletMaps } from './maps/components/leafletMaps/leafletMaps.component';
import { LineMapComponent } from './maps/components/lineMaps/line-map.component';
import { BubbleMapsService } from './maps/components/bubbleMaps/bubbleMaps.service';
import { LineMapService } from './maps/components/lineMaps/line-map.service';

// Tables
import { TablesModule } from './tables/tables.module';
// import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { DataTableModule } from "angular2-datatable";
// import { BasicTableComponent } from './tables/components/basicTables/basic-table.component';
// import { DataTableComponent } from './tables/components/dataTables/data-table.component';
// import { HotTableComponent } from './tables/components/hotTables/hot-table.component';
// import { SmartTableComponent } from './tables/components/smartTables/smart-table.component';

@NgModule({
  imports: [
    // DataTableModule,
    // Ng2SmartTableModule,
    TablesModule,
    CommonModule,
    FormsModule,
    NgaModule,
  ],
  exports: [ 
    LineMapComponent,
    TablesModule
    // BasicTableComponent,
    // DataTableComponent,
    // HotTableComponent,
    // SmartTableComponent
  ],
  declarations: [
    BubbleMaps,
    GoogleMaps,
    LeafletMaps,
    LineMapComponent
    // BasicTableComponent,
    // DataTableComponent,
    // HotTableComponent,
    // SmartTableComponent
  ],
  providers: [
    BubbleMapsService,
    LineMapService
  ]
})
export class SharedModule {}
