import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { SecuritySettingsComponent } from './security-settings/security-settings.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';

type AccountTaps = 'profile' | 'security';

@Component({
  selector: 'ms-account',
  imports: [ProfileSettingsComponent, SecuritySettingsComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  authService = inject(AuthService);

  tab = signal<AccountTaps>('profile');

  setTab(tab: AccountTaps): void {
    this.tab.set(tab);
  }
}
