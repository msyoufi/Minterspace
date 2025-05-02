import { Component, computed, inject, signal } from '@angular/core';
import { PortfolioControlBarComponent } from './portfolio-control-bar/portfolio-control-bar.component';
import { EmtpyPortfolioSVGComponent } from './emtpy-portfolio-svg/emtpy-portfolio-svg.component';
import { PortfolioStatsPanesComponent } from './portfolio-stats-panes/portfolio-stats-panes.component';
import { AssetAllocationChartComponent } from './asset-allocation-chart/asset-allocation-chart.component';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { PortfolioCoinSelectMenuComponent } from './portfolio-coin-select-menu/portfolio-coin-select-menu.component';
import { PortfolioStateService } from '../portfolio-state.service';
import { PortfolioService } from '../../../shared/services/portfolio.service';
import { AssetBarLoaderComponent } from './assets-list/asset-bar-loader/asset-bar-loader.component';

@Component({
  selector: 'ms-portfolio-overview',
  imports: [PortfolioControlBarComponent, EmtpyPortfolioSVGComponent, PortfolioStatsPanesComponent, AssetAllocationChartComponent, AssetsListComponent, PortfolioCoinSelectMenuComponent, AssetBarLoaderComponent],
  templateUrl: './portfolio-overview.component.html',
  styleUrl: './portfolio-overview.component.scss'
})
export class PortfolioOverviewComponent {
  portfolioService = inject(PortfolioService);
  portfolioState = inject(PortfolioStateService);

  isCoinSelectMenuOpen = signal(false);
  portfolioCoinsCount = computed(() => this.portfolioService.currentPortfolio$()?.coins?.length ?? 0);
  emptyAssetsArray = computed(() => Array.from({ length: this.portfolioCoinsCount() }));

  openSelectMenu(): void {
    this.isCoinSelectMenuOpen.set(true);
  }

  onSelectMenuClose(): void {
    this.isCoinSelectMenuOpen.set(false);
  }
}
