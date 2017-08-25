import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './admin.routing';
import { AdminComponent } from './admin.component';
import { Buttons } from './components/buttons/buttons.component';
import { Grid } from './components/grid/grid.component';
import { Icons } from './components/icons/icons.component';
import { Modals } from './components/modals/modals.component';
import { SlimComponent } from './components/slim/slim.component';
import { HotTable, HotTableModule } from 'ng2-handsontable';
import { TreeModule } from 'ng2-tree';
import { FlatButtons } from './components/buttons/components/flatButtons';
import { RaisedButtons } from './components/buttons/components/raisedButtons';
import { SizedButtons } from './components/buttons/components/sizedButtons';
import { DisabledButtons } from './components/buttons/components/disabledButtons';
import { IconButtons } from './components/buttons/components/iconButtons';
import { LargeButtons } from './components/buttons/components/largeButtons';
import { DropdownButtons } from './components/buttons/components/dropdownButtons';
import { GroupButtons } from './components/buttons/components/groupButtons';
import { IconsService } from './components/icons/icons.service';
import { DefaultModal } from './components/modals/default-modal/default-modal.component';

import { XmlComponent } from './components/xml/xml.component';
import { XmlService } from './components/xml.service';
import { ArticlesComponent } from './components/articles/articles.component';
import { ArticlesService } from './components/articles/articles.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    TreeModule,
    CommonModule,
    FormsModule,
    NgaModule,
    NgbDropdownModule,
    NgbModalModule,
    SlimLoadingBarModule.forRoot(),
    HotTableModule,
    routing
  ],
  declarations: [
    Buttons,
    Grid,
    Icons,
    Modals,
    SlimComponent,
    XmlComponent,
    ArticlesComponent,
    AdminComponent,
    FlatButtons,
    RaisedButtons,
    SizedButtons,
    DisabledButtons,
    IconButtons,
    LargeButtons,
    DropdownButtons,
    GroupButtons,
    DefaultModal
  ],
  entryComponents: [
    DefaultModal
  ],
  providers: [
    IconsService, XmlService, ArticlesService
  ]
})
export class AdminModule {
}
