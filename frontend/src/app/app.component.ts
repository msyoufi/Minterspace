import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AuthModalComponent } from "./components/auth-modal/auth-modal.component";
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'ms-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AuthModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  authService = inject(AuthService);
}
