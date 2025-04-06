import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CoinDetailsComponent } from './pages/coin-details/coin-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'coins/:id', component: CoinDetailsComponent }
];
