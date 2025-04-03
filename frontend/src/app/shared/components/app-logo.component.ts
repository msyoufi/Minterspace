import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ms-app-logo',
  imports: [RouterLink],
  template: '<a routerLink="/" class="app-logo">MinterSpace</a>',
  styles: `
    .app-logo {
    width: fit-content;
    height: fit-content;
    color: var(--primary-color);
    font-size: 1.3rem;
    font-weight: 600;
    text-decoration: none;
    padding: .2rem .5rem;
    border-radius: var(--radius-s);
    border: 2px solid var(--primary-color);
    transition: var(--transition);
    user-select: none;
  }

  .app-logo:hover {
    color: var(--text-color);
  }
`
})
export class AppLogoComponent {

}
