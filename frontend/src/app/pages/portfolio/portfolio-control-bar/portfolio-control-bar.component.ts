import { Component } from '@angular/core';
import { NameInputPaneComponent } from '../../../shared/components/name-input-pane/name-input-pane.component';

@Component({
  selector: 'ms-portfolio-control-bar',
  imports: [NameInputPaneComponent],
  templateUrl: './portfolio-control-bar.component.html',
  styleUrl: './portfolio-control-bar.component.scss'
})
export class PortfolioControlBarComponent {

}
