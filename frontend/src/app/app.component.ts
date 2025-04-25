import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AuthModalComponent } from "./components/auth-modal/auth-modal.component";
import { AuthService } from './shared/services/auth.service';
import { TransactionFormModalComponent } from './components/transaction-form-modal/transaction-form-modal.component';
import { TransactionModalService } from './shared/services/transaction-modal.service';

@Component({
  selector: 'ms-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AuthModalComponent, TransactionFormModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  authService = inject(AuthService);
  transactionModalService = inject(TransactionModalService);
}
