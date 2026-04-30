// Feature module bundles the page, Ionic components, and related routing.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { AddPageRoutingModule } from './add-routing.module';
import { AddPage } from './add.page';

@NgModule({
  // Imports list only the capabilities this page needs, keeping the module focused.
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    AddPageRoutingModule
  ],
  // The page component is declared here because this project uses NgModule-based Ionic pages.
  declarations: [AddPage]
})
export class AddPageModule {}