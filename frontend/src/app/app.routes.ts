import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CoinDetailsComponent } from './pages/coin-details/coin-details.component';
import { AccountComponent } from './pages/account/account.component';
import { authGuard } from './auth.guard';
import { WatchlistComponent } from './pages/watchlist/watchlist.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { AssetDetailsComponent } from './pages/portfolio/asset-details/asset-details.component';
import { PortfolioOverviewComponent } from './pages/portfolio/portfolio-overview/portfolio-overview.component';
import { ExchangesComponent } from './pages/exchanges/exchanges.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsOfUseComponent } from './pages/terms-of-use/terms-of-use.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'coins/:id', component: CoinDetailsComponent },
  { path: 'watchlist', component: WatchlistComponent, canActivate: [authGuard] },
  { path: 'exchanges', component: ExchangesComponent },
  {
    path: 'portfolio', component: PortfolioComponent, canActivate: [authGuard], children: [
      { path: '', component: PortfolioOverviewComponent, pathMatch: 'full' },
      { path: ':id', component: AssetDetailsComponent }
    ]
  },
  { path: 'account', component: AccountComponent, canActivate: [authGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'terms-of-use', component: TermsOfUseComponent },
];