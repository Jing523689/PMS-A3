// Feature module bundles the page, Ionic components, and related routing.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { ListPageRoutingModule } from './list-routing.module';
import { ListPage } from './list.page';

@NgModule({
  // Imports list only the capabilities this page needs, keeping the module focused.
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ListPageRoutingModule
  ],
  // The page component is declared here because this project uses NgModule-based Ionic pages.
  declarations: [ListPage]
})
export class ListPageModule {}