import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbsolutPipe } from '../../../../../shared/pipes/absolut.pipe';

@Component({
  selector: 'ms-totals-pane',
  imports: [CommonModule, AbsolutPipe],
  templateUrl: './totals-pane.component.html',
  styleUrl: '../portfolio-stats-panes.component.scss'
})
export class TotalsPaneComponent {
  total_balance = input.required<number>();
  total_profit_loss = input.required<number>();
  total_profit_loss_percentage = input.required<number>();
}
