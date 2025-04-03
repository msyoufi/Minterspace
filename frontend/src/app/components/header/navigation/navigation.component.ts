import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'ms-navigation',
  imports: [RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  router = inject(Router);

  isNavMenuOpen = signal(false);

  toggleNavMenu(): void {
    this.isNavMenuOpen.set(!this.isNavMenuOpen());
  }
}
