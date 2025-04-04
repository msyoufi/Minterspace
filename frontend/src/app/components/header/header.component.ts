import { Component, DestroyRef, inject, signal } from '@angular/core';
import { GlobalMarketBarComponent } from "./global-market-bar/global-market-bar.component";
import { AccountButtonComponent } from "./account-button/account-button.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { HeaderSearchBarComponent } from "./header-search-bar/header-search-bar.component";
import { ThemeButtonComponent } from "./theme-button/theme-button.component";
import { AppLogoComponent } from "../../shared/components/app-logo.component";
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ms-header',
  imports: [GlobalMarketBarComponent, AccountButtonComponent, NavigationComponent, HeaderSearchBarComponent, ThemeButtonComponent, AppLogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
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
