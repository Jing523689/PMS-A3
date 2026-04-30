// Shared module exports reusable UI pieces used across multiple pages.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HelpWidgetComponent } from './components/help-widget/help-widget.component';

@NgModule({
  // HelpWidgetComponent is declared here once and reused by all four tabs.
  declarations: [HelpWidgetComponent],
  // CommonModule supports Angular template syntax; IonicModule provides ion-button and ion-icon.
  imports: [CommonModule, IonicModule],
  // Exporting the component lets feature modules place the help button in their toolbars.
  exports: [HelpWidgetComponent]
})
export class SharedModule {}
