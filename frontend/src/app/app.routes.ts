import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CoinDetailsComponent } from './pages/coin-details/coin-details.component';
import { AccountComponent } from './pages/account/account.component';
import { authGuard } from './auth.guard';
import { WatchlistComponent } from './pages/watchlist/watchlist.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { AssetDetailsComponent } from './pages/portfolio/asset-details/asset-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'coins/:id', component: CoinDetailsComponent },
  { path: 'watchlist', component: WatchlistComponent, canActivate: [authGuard] },
  {
    path: 'portfolio', component: PortfolioComponent, canActivate: [authGuard], children: [
      { path: ':id', component: AssetDetailsComponent }
    ]
  },
  { path: 'account', component: AccountComponent, canActivate: [authGuard] },
];