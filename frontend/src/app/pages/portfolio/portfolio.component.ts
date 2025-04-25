import { Component, inject, signal } from '@angular/core';
import { PortfolioControlBarComponent } from './portfolio-control-bar/portfolio-control-bar.component';
import { PortfolioStatsPanesComponent } from './portfolio-stats-panes/portfolio-stats-panes.component';
import { AssetAllocationChartComponent } from './asset-allocation-chart/asset-allocation-chart.component';
import { EmtpyPortfolioSVGComponent } from './emtpy-portfolio-svg/emtpy-portfolio-svg.component';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { RouterOutlet } from '@angular/router';
import { PortfolioCoinSelectMenuComponent } from './portfolio-coin-select-menu/portfolio-coin-select-menu.component';
import { PortfolioService } from '../../shared/services/portfolio.service';

@Component({
  selector: 'ms-portfolio',
  imports: [PortfolioControlBarComponent, EmtpyPortfolioSVGComponent, PortfolioStatsPanesComponent, AssetAllocationChartComponent, AssetsListComponent, PortfolioCoinSelectMenuComponent, RouterOutlet],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
  portfolioService = inject(PortfolioService);

  isCoinSelectMenuOpen = signal(false);
  isLoading = signal(false);


  openSelectMenu(): void {
    this.isCoinSelectMenuOpen.set(true);
  }

  onSelectMenuClose(): void {
    this.isCoinSelectMenuOpen.set(false);
  }
}
