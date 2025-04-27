import { Component, inject, signal } from '@angular/core';
import { PortfolioControlBarComponent } from './portfolio-control-bar/portfolio-control-bar.component';
import { EmtpyPortfolioSVGComponent } from './emtpy-portfolio-svg/emtpy-portfolio-svg.component';
import { PortfolioStatsPanesComponent } from './portfolio-stats-panes/portfolio-stats-panes.component';
import { AssetAllocationChartComponent } from './asset-allocation-chart/asset-allocation-chart.component';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { PortfolioService } from '../../../shared/services/portfolio.service';
import { PortfolioCoinSelectMenuComponent } from './portfolio-coin-select-menu/portfolio-coin-select-menu.component';

@Component({
  selector: 'ms-portfolio-overview',
  imports: [PortfolioControlBarComponent, EmtpyPortfolioSVGComponent, PortfolioStatsPanesComponent, AssetAllocationChartComponent, AssetsListComponent, PortfolioCoinSelectMenuComponent],
  templateUrl: './portfolio-overview.component.html',
  styleUrl: './portfolio-overview.component.scss'
})
export class PortfolioOverviewComponent {
  portfolioService = inject(PortfolioService);

  isCoinSelectMenuOpen = signal(false);

  openSelectMenu(): void {
    this.isCoinSelectMenuOpen.set(true);
  }

  onSelectMenuClose(): void {
    this.isCoinSelectMenuOpen.set(false);
  }
}
