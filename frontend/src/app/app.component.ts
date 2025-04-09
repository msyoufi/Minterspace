import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AuthModalComponent } from "./components/auth-modal/auth-modal.component";
import { AuthModalService } from './components/auth-modal/auth-modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ms-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AuthModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  authModel = inject(AuthModalService);
  destroyRef = inject(DestroyRef);

  isAuthModalOpen = signal(false);

  constructor() {
    this.authModel.isModalOpen
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isModalOpen => this.isAuthModalOpen.set(isModalOpen));
  }
}
