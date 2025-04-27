import { Component, effect, inject, signal } from '@angular/core';
import { PortfolioService } from '../../../../shared/services/portfolio.service';
import { PerformancePaneComponent } from '../../../../shared/components/performance-pane/performance-pane.component';
import { RouterLink } from '@angular/router';
import { TotalsPaneComponent } from './totals-pane/totals-pane.component';

@Component({
  selector: 'ms-portfolio-stats-panes',
  imports: [PerformancePaneComponent, RouterLink, TotalsPaneComponent],
  templateUrl: './portfolio-stats-panes.component.html',
  styleUrl: './portfolio-stats-panes.component.scss'
})
export class PortfolioStatsPanesComponent {
  portfolioService = inject(PortfolioService);

  stats = signal<PortfolioStats | null>(null);
  topGainer = signal<Asset | null>(null);
  worstGainer = signal<Asset | null>(null);

  constructor() {
    effect(() => this.getStats());
  }

  getStats(): void {
    const portfolioData = this.portfolioService.currentPortfolioData$();
    if (!portfolioData) return;

    const { assets, stats } = portfolioData;

    const topGainer = assets.find(ast => ast.coin_id === stats.top_gainer_id)!;
    const worstGainer = assets.find(ast => ast.coin_id === stats.worst_gainer_id)!;

    this.stats.set(stats);
    this.topGainer.set(topGainer);
    this.worstGainer.set(worstGainer);
  }
}
