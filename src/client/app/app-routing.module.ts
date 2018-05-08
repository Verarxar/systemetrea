import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found.component';
import { PreloadSelectedModulesList } from './core/preload-strategy';
import { AuthGuard, CanDeactivateGuard, UserProfileService } from './core';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'articles' },
  {
    path: 'articles',
    loadChildren: 'app/articles/articles.module#ArticlesModule',
    data: { preload: true }
  }, {
    path: 'about',
    loadChildren: 'app/about/about.module#AboutModule',
    data: { preload: true }
  },
  { path: '*', pathMatch: 'full', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadSelectedModulesList
    })
  ],
  exports: [RouterModule],
  providers: [AuthGuard, CanDeactivateGuard, PreloadSelectedModulesList, UserProfileService]
})
export class AppRoutingModule {}

