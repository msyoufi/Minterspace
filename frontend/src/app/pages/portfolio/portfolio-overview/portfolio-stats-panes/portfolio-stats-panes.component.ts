import { Component, effect, inject, signal } from '@angular/core';
import { PerformancePaneComponent } from '../../../../shared/components/performance-pane/performance-pane.component';
import { RouterLink } from '@angular/router';
import { TotalsPaneComponent } from './totals-pane/totals-pane.component';
import { PortfolioStateService } from '../../portfolio-state.service';

@Component({
  selector: 'ms-portfolio-stats-panes',
  imports: [PerformancePaneComponent, RouterLink, TotalsPaneComponent],
  templateUrl: './portfolio-stats-panes.component.html',
  styleUrl: './portfolio-stats-panes.component.scss'
})
export class PortfolioStatsPanesComponent {
  portfolioState = inject(PortfolioStateService);

  stats = signal<PortfolioStats | null>(null);
  topGainer = signal<Asset | null>(null);
  worstGainer = signal<Asset | null>(null);

  constructor() {
    effect(() => this.getStats());
  }

  getStats(): void {
    const portfolioData = this.portfolioState.portfolioData$()!;
    const { assets, stats } = portfolioData;

    const topGainer = assets.find(ast => ast.coin_id === stats.top_gainer_id)!;
    const worstGainer = assets.find(ast => ast.coin_id === stats.worst_gainer_id)!;

    this.stats.set(stats);
    this.topGainer.set(topGainer);
    this.worstGainer.set(worstGainer);
  }
}
