// Feature module bundles the page, Ionic components, and related routing.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { EditPageRoutingModule } from './edit-routing.module';
import { EditPage } from './edit.page';

@NgModule({
  // Imports list only the capabilities this page needs, keeping the module focused.
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    EditPageRoutingModule
  ],
  // The page component is declared here because this project uses NgModule-based Ionic pages.
  declarations: [EditPage]
})
export class EditPageModule {}