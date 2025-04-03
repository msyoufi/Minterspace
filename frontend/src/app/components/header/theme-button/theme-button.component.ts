import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'ms-theme-button',
  imports: [],
  templateUrl: './theme-button.component.html',
  styleUrl: './theme-button.component.scss'
})
export class ThemeButtonComponent {
  isDarkTheme = signal(true);

  constructor() {
    this.setInitialTheme();
    effect(() => this.toggleAppTheme());
  }

  setInitialTheme(): void {
    const isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme') || 'true');
    this.isDarkTheme.set(isDarkTheme);
  }

  toggleColorTheme(): void {
    this.isDarkTheme.set(!this.isDarkTheme());
  }

  toggleAppTheme(): void {
    if (this.isDarkTheme())
      document.body.classList.remove('light-theme');
    else
      document.body.classList.add('light-theme');

    localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme()));
  }
}
