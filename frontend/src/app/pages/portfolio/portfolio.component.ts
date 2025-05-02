import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortfolioStateService } from './portfolio-state.service';

@Component({
  selector: 'ms-portfolio',
  imports: [RouterOutlet],
  providers: [PortfolioStateService],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
}