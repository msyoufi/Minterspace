import { Component } from '@angular/core';
import { PortfolioControlBarComponent } from './portfolio-control-bar/portfolio-control-bar.component';
import { PortfolioStatsPanesComponent } from './portfolio-stats-panes/portfolio-stats-panes.component';
import { AssetAllocationChartComponent } from './asset-allocation-chart/asset-allocation-chart.component';
import { EmtpyPortfolioSVGComponent } from './emtpy-portfolio-svg/emtpy-portfolio-svg.component';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'ms-portfolio',
  imports: [PortfolioControlBarComponent, EmtpyPortfolioSVGComponent, PortfolioStatsPanesComponent, AssetAllocationChartComponent, AssetsListComponent, RouterOutlet],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {

}
