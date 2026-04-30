import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPage } from './privacy.page';

// Page-level route keeps each lazy-loaded feature module self-contained.
const routes: Routes = [
  {
    // Empty path means the component renders when its tab route is opened.
    path: '',
    component: PrivacyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacyPageRoutingModule {}