import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { UsernameFormComponent } from './username-form/username-form.component';
import { BioFormComponent } from './bio-form/bio-form.component';
import { AuthService } from '../../../shared/services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ms-profile-settings',
  imports: [MatExpansionModule, UsernameFormComponent, BioFormComponent, DatePipe],
  templateUrl: './profile-settings.component.html',
  styleUrl: '../account.component.scss'
})
export class ProfileSettingsComponent {
  authService = inject(AuthService);

  onLogoutClick(): void {
    this.authService.logout();
  }
}
