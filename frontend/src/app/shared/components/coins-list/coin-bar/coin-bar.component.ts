import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WatchlistStarComponent } from "../../watchlist-star.component";
import { CommonModule } from '@angular/common';
import { AbsolutPipe } from '../../../pipes/absolut.pipe';
import { SparklineComponent } from "../../sparkline.component";

@Component({
  selector: 'ms-coin-bar',
  imports: [RouterLink, CommonModule, AbsolutPipe, WatchlistStarComponent, SparklineComponent],
  templateUrl: './coin-bar.component.html',
  styleUrls: [
    './coin-bar.component.scss',
    '../coins-list.component.scss'
  ]
})
export class CoinBarComponent {
  coin = input.required<CoinBasic>();

}
