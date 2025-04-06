import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbsolutPipe } from '../../../shared/pipes/absolut.pipe';

@Component({
  selector: 'ms-coin-details-header',
  imports: [CommonModule, AbsolutPipe],
  templateUrl: './coin-details-header.component.html',
  styleUrl: './coin-details-header.component.scss'
})
export class CoinDetailsHeaderComponent {
  coin = input.required<CoinDetails>();
}
