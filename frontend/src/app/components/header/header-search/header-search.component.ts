import { Component, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';

@Component({
  selector: 'ms-header-search',
  imports: [ClickOutsideDirective],
  templateUrl: './header-search.component.html',
  styleUrl: './header-search.component.scss'
})
export class HeaderSearchComponent {
  isSearchPanelOpen = signal(false);

  openSearchPanel(e: MouseEvent | FocusEvent): void {
    this.isSearchPanelOpen.set(true);
  }

  closeSearchPanel(): void {
    this.isSearchPanelOpen.set(false);
  }
}
