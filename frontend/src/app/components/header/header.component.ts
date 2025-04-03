import { Component } from '@angular/core';
import { GlobalMarketBarComponent } from "./global-market-bar/global-market-bar.component";
import { AccountButtonComponent } from "./account-button/account-button.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { HeaderSearchBarComponent } from "./header-search-bar/header-search-bar.component";
import { ThemeButtonComponent } from "./theme-button/theme-button.component";
import { AppLogoComponent } from "../../shared/components/app-logo/app-logo.component";

@Component({
  selector: 'ms-header',
  imports: [GlobalMarketBarComponent, AccountButtonComponent, NavigationComponent, HeaderSearchBarComponent, ThemeButtonComponent, AppLogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
