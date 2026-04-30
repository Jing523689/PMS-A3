// Feature module bundles the page, Ionic components, and related routing.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { PrivacyPageRoutingModule } from './privacy-routing.module';
import { PrivacyPage } from './privacy.page';

@NgModule({
  // Imports list only the capabilities this page needs, keeping the module focused.
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    PrivacyPageRoutingModule
  ],
  // The page component is declared here because this project uses NgModule-based Ionic pages.
  declarations: [PrivacyPage]
})
export class PrivacyPageModule {}