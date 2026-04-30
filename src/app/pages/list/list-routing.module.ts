import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPage } from './list.page';

// Page-level route keeps each lazy-loaded feature module self-contained.
const routes: Routes = [
  {
    // Empty path means the component renders when its tab route is opened.
    path: '',
    component: ListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListPageRoutingModule {}