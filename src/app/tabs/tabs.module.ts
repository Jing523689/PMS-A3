// Tabs module declares the bottom-navigation shell for the app.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';

@NgModule({
  // Tabs only needs common Angular directives, Ionic tab components, and its child routes.
  imports: [
    CommonModule,
    IonicModule,
    TabsPageRoutingModule
  ],
  // The tab shell is declared here because feature pages are loaded as child modules.
  declarations: [TabsPage]
})
export class TabsPageModule {}
