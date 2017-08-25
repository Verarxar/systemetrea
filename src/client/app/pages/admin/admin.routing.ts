import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { Buttons } from './components/buttons/buttons.component';
import { Grid } from './components/grid/grid.component';
import { Icons } from './components/icons/icons.component';
import { Modals } from './components/modals/modals.component';
import { XmlComponent } from './components/xml/xml.component';
import { SlimComponent } from './components/slim/slim.component';
import { ArticlesComponent } from './components/articles/articles.component';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'xml', component: XmlComponent },
      { path: 'articles', component: ArticlesComponent },
      { path: 'buttons', component: Buttons },
      { path: 'grid', component: Grid },
      { path: 'icons', component: Icons },
      { path: 'modals', component: Modals },
      { path: 'slim', component: SlimComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
