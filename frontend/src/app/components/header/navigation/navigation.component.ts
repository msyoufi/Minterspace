import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

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
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(e => this.isNavMenuOpen.set(false));
  }

  toggleNavMenu(): void {
    this.isNavMenuOpen.set(!this.isNavMenuOpen());
  }
}
