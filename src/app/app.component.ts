import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {
  // Root component only hosts the Ionic router outlet.
  // Feature logic is kept inside page components and services for cleaner architecture.
}
