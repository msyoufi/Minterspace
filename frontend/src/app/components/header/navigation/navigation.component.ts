import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'ms-navigation',
  imports: [RouterLink],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  router = inject(Router);
  destroyRef = inject(DestroyRef);

  user = input.required<User | null>();
  isNavMenuOpen = signal(false);

  constructor() {
    this.closeNavMenuOnNavigationEnd();
  }

  closeNavMenuOnNavigationEnd(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(e => this.isNavMenuOpen.set(false));
  }

  toggleNavMenu(): void {
    this.isNavMenuOpen.set(!this.isNavMenuOpen());
  }
}
