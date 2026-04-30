import { Component, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-help-widget',
  templateUrl: './help-widget.component.html',
  styleUrls: ['./help-widget.component.scss'],
  standalone: false
})
export class HelpWidgetComponent {
  // Reusable text inputs let each tab provide context-specific help content.
  @Input() title = 'Help';
  @Input() message = '';
  @Input() icon = 'help-circle-outline';

  constructor(private alertController: AlertController) {}

  /**
   * Presents help text in an Ionic alert.
   * This is mobile-friendly because it keeps support content close to the page
   * without forcing users to navigate away from the current workflow.
   */
  async openHelp(): Promise<void> {
    const alert = await this.alertController.create({
      header: this.title,
      message: this.message,
      buttons: ['Got it']
    });

    await alert.present();
  }
}
