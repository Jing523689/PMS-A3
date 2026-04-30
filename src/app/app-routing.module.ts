import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// Root routing keeps the app shell small and lazy-loads the tab experience.
// This supports mobile performance because feature pages are split into modules.
const routes: Routes = [
  {
    // Opening the app takes users straight to the inventory list workflow.
    path: '',
    redirectTo: 'tabs/list',
    pathMatch: 'full'
  },
  {
    // Tabs are loaded as a feature module to keep navigation concerns isolated.
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // Preloading improves perceived speed after the first page is ready.
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
