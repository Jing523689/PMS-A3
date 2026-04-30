import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

// Child routes map each tab button to a lazy-loaded page module.
// This keeps Inventory, Add, Manage, and Privacy features separated.
const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        // Tab 1: browse, refresh, filter, and exact-search inventory records.
        path: 'list',
        loadChildren: () =>
          import('../pages/list/list.module').then((m) => m.ListPageModule)
      },
      {
        // Tab 2: create inventory records and review featured items.
        path: 'add',
        loadChildren: () =>
          import('../pages/add/add.module').then((m) => m.AddPageModule)
      },
      {
        // Tab 3: search, update, and delete existing records.
        path: 'edit',
        loadChildren: () =>
          import('../pages/edit/edit.module').then((m) => m.EditPageModule)
      },
      {
        // Tab 4: explain privacy and security practices for the mobile app.
        path: 'privacy',
        loadChildren: () =>
          import('../pages/privacy/privacy.module').then((m) => m.PrivacyPageModule)
      },
      {
        // Default tab route prevents blank content if /tabs is opened directly.
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
