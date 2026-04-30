import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false
})
export class TabsPage {
  // The page shell is intentionally light; navigation structure lives in the template.
  // This keeps tab rendering fast and avoids unnecessary state in the root tab component.
}
