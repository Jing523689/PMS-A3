import { Component } from '@angular/core';

// View model for each privacy/security card.
// Keeping the content in TypeScript makes the template clean and easy to extend.
interface PrivacyTopic {
  icon: string;
  title: string;
  body: string;
}

/**
 * PrivacyPage responsibilities:
 * - Present assessment-aligned security and privacy notes.
 * - Use a data-driven card layout for consistent mobile scanning.
 * - Keep explanatory content separate from the static HTML template.
 * - Reuse the shared help widget just like the other tabs.
 */

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  standalone: false
})
export class PrivacyPage {
  // Short guidance text displayed by the shared help widget.
  readonly helpMessage =
    'This page explains the privacy and security practices that are relevant to the mobile inventory app, including validation, HTTPS, safe deletion, and local data minimisation.';

  // Topics are data-driven so each card uses one reusable template structure.
  // This improves maintainability and keeps the page consistent on mobile screens.
  topics: PrivacyTopic[] = [
    {
      icon: 'checkmark-done-circle-outline',
      title: 'Input validation',
      body: 'Required fields are checked before submission. Names use text-friendly validation, while quantity and price must be whole numbers greater than or equal to zero.'
    },
    {
      icon: 'lock-closed-outline',
      title: 'Secure transmission',
      body: 'The app communicates with the REST endpoint over HTTPS, reducing the risk of inventory data being exposed while moving between the device and server.'
    },
    {
      icon: 'trash-outline',
      title: 'Safe update and delete',
      body: 'Changes provide toast feedback, and delete actions use a confirmation prompt so users understand they are modifying a shared database.'
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Least privilege',
      body: 'The application does not request unnecessary mobile permissions. It focuses only on inventory operations required by the assessment scope.'
    },
    {
      icon: 'alert-circle-outline',
      title: 'Error handling',
      body: 'Errors are shown as user-friendly messages rather than exposing internal database details or confusing HTTP failure text.'
    },
    {
      icon: 'phone-portrait-outline',
      title: 'Local data minimisation',
      body: 'Inventory records are loaded from the server when needed. The app avoids storing unnecessary sensitive data locally on the device.'
    }
  ];

  /**
   * Provides a stable identity for ngFor so cards do not re-render unnecessarily.
   */
  trackByTitle(index: number, topic: PrivacyTopic): string {
    return topic.title || String(index);
  }
}
