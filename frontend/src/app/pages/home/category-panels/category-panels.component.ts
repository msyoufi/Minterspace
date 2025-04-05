import { Component, computed, input } from '@angular/core';
import { MarketCapPanelComponent } from "./market-cap-panel.component";
import { VolumePanelComponent } from "./volume-panel.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AbsolutPipe } from '../../../shared/pipes/absolut.pipe';

@Component({
  selector: 'ms-category-panels',
  imports: [CommonModule, RouterLink, MarketCapPanelComponent, VolumePanelComponent, AbsolutPipe],
  templateUrl: './category-panels.component.html',
  styleUrl: './category-panels.component.scss'
})
export class CategoryPanelsComponent {
  category = input.required<CoinCategory | GlobalMarket>();
  categoryData = computed(() => extractCategoryData(this.category()));

  globalMarket = computed<GlobalMarket | null>(() =>
    'data' in this.category() ? this.category() as GlobalMarket : null
  );

  coinCategory = computed<CoinCategory | null>(() =>
    'data' in this.category() ? null : this.category() as CoinCategory
  );
}

function extractCategoryData(current: CoinCategory | GlobalMarket): CategoryData {
  const data = 'data' in current
    ? {
      header: 'Global Market',
      marketCap: current.data.total_market_cap.usd,
      marketCapchange: current.data.market_cap_change_percentage_24h_usd,
      volume: current.data.total_volume.usd,
      indicatorClass: ''
    }
    : {
      header: current.name,
      marketCap: current.market_cap || 0,
      marketCapchange: current.market_cap_change_24h || 0,
      volume: current.volume_24h || 0,
      indicatorClass: ''
    }

  data.indicatorClass = data.marketCapchange < 0 ? 'desc red' : 'asc green';

  return data;
}
