import { Component, DestroyRef, inject, signal } from '@angular/core';
import { GlobalMarketBarComponent } from "./global-market-bar/global-market-bar.component";
import { AccountButtonComponent } from "./account-button/account-button.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { HeaderSearchComponent } from "./header-search/header-search.component";
import { ThemeButtonComponent } from "./theme-button/theme-button.component";
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../shared/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ms-header',
  imports: [RouterLink, GlobalMarketBarComponent, AccountButtonComponent, NavigationComponent, HeaderSearchComponent, ThemeButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authService = inject(AuthService);
  breakpointObserver = inject(BreakpointObserver);
  destroyRef = inject(DestroyRef);

  isSmallScreen = signal(false);

  constructor() {
    this.subscribeToScreenResize();
  }

  subscribeToScreenResize(): void {
    this.breakpointObserver.observe(['(max-width: 880px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => this.isSmallScreen.set(result.matches));
  }
}
