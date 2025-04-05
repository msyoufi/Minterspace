import { Component } from '@angular/core';
import { AppLogoComponent } from "../../shared/components/app-logo.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ms-footer',
  imports: [AppLogoComponent, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
