import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CoinDetailsComponent } from './pages/coin-details/coin-details.component';
import { authGuard } from './auth.guard';
import { AssetDetailsComponent } from './pages/portfolio/asset-details/asset-details.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsOfUseComponent } from './pages/terms-of-use/terms-of-use.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'coins/:id', component: CoinDetailsComponent },
  {
    path: 'watchlist',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/watchlist/watchlist.component').then(m => m.WatchlistComponent)
  },
  {
    path: 'exchanges',
    loadComponent: () =>
      import('./pages/exchanges/exchanges.component').then(m => m.ExchangesComponent)
  },
  {
    path: 'portfolio',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/portfolio/portfolio.component').then(m => m.PortfolioComponent),
    children: [
      {
        path: '', pathMatch: 'full',
        loadComponent: () =>
          import('./pages/portfolio/portfolio-overview/portfolio-overview.component').then(m => m.PortfolioOverviewComponent),
      },
      { path: ':id', component: AssetDetailsComponent }
    ]
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/account/account.component').then(m => m.AccountComponent)
  },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'terms-of-use', component: TermsOfUseComponent },
];