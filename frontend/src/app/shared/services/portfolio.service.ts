import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  private BASE_URL = 'http://127.0.0.1:8000/api/portfolio/';

  public portfolios$ = signal<Portfolio[]>([]);
  public currentPortfolio$ = signal<Portfolio | null>(null);

  // The main Portfolio is created on accout creation and cannot be deleted by the user
  public mainPortfolio = computed(() =>
    this.portfolios$().find(pf => pf.is_main) ?? null
  );

  public mustFetchNewData = signal<boolean>(true);

  get currentId(): number | bigint | null {
    return this.currentPortfolio$()?.id ?? null;
  }

  constructor() {
    effect(() => this.getUserPortfolios());
  }

  private getUserPortfolios(): void {
    this.authService.user$()
      ? this.getAllPortfolios()
      : this.setPortfolios([], null);
  }

  private async getAllPortfolios(): Promise<void> {
    const portfolios = await this.fetchPortfolios();
    const mainPortfolio = portfolios.find(pf => pf.is_main) ?? null;

    this.setPortfolios(portfolios, mainPortfolio);
  }

  private async fetchPortfolios(): Promise<Portfolio[]> {
    console.log('fetch meta data')
    try {
      const response$ = this.http.get<Portfolio[]>(this.BASE_URL);
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return [];
    }
  }

  async fetchPortfolioData(portfolioId: number | bigint): Promise<PortfolioData | EmptyPortfolio | null> {
    console.log('fetch data')
    try {
      const response$ = this.http.get<PortfolioData>(this.BASE_URL + 'data/' + portfolioId);
      const data = await firstValueFrom(response$);

      if (!data)
        return { id: portfolioId }

      return data;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return null;
    }
  }

  async createPortfolio(name: string, is_main = false): Promise<Portfolio | null> {
    const createdPortfolio = await this.create({ name, is_main });
    if (!createdPortfolio) return null;

    const newPortfolios = [...this.portfolios$(), createdPortfolio];
    this.setPortfolios(newPortfolios, createdPortfolio);

    return createdPortfolio;
  }

  private async create(portfolioData: Omit<Portfolio, 'coins' | 'id'>): Promise<Portfolio | null> {
    try {
      const response$ = this.http.post<Portfolio>(this.BASE_URL, portfolioData);
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return null;
    }
  }

  async updatePortfolio(portfolioId: number | bigint, changes: { name?: string, coins?: string[] }): Promise<Portfolio | null> {
    if (!changes.coins && !changes.name)
      return null;

    const updatedPortfolio = await this.update(portfolioId, changes);
    if (!updatedPortfolio) return null;

    const newPortfolios = this.portfolios$().map(pf =>
      pf.id === portfolioId ? updatedPortfolio : pf
    );

    this.setPortfolios(newPortfolios, updatedPortfolio);

    return updatedPortfolio;
  }

  private async update(portfolioId: number | bigint, changes: { name?: string, coins?: string[] }): Promise<Portfolio | null> {
    try {
      const response$ = this.http.patch<Portfolio>(this.BASE_URL + portfolioId, changes);
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return null;
    }
  }

  async deletePortfolio(portfolioId: number | bigint): Promise<boolean> {
    if (portfolioId === this.mainPortfolio()?.id)
      return false;

    const result = await this.delete(portfolioId);
    if (!result) return false;

    const newPortfolios = this.portfolios$().filter(pf => pf.id !== portfolioId);
    this.setPortfolios(newPortfolios, this.mainPortfolio());

    return true;
  }

  private async delete(portfolioId: number | bigint): Promise<boolean> {
    try {
      const response$ = this.http.delete<null>(this.BASE_URL + portfolioId);
      await firstValueFrom(response$);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  private setPortfolios(all: Portfolio[], current: Portfolio | null): void {
    this.portfolios$.set(all);
    this.currentPortfolio$.set(current);
  }

  public setCurrentPortfolioById(id: number | bigint): void {
    const portfolio = this.portfolios$().find(pf => pf.id === id) ?? null;
    this.currentPortfolio$.set(portfolio);
    this.mustFetchNewData.set(true);
  }

  syncPortfolioCoins(newData: PortfolioData | EmptyPortfolio): void {
    const currentPortfolio = this.currentPortfolio$();
    if (!currentPortfolio) return;

    let newCoins: string[] = [];

    if ('assets' in newData)
      newCoins = Object.keys(newData.transactions_by_coin);

    if (newCoins.length === currentPortfolio.coins.length)
      return;

    console.log('sync coins')

    const updatedPortfolio = { ...currentPortfolio, coins: newCoins };

    const newPortfolios = this.portfolios$().map(pf =>
      pf.id === newData.id ? updatedPortfolio : pf
    );

    this.setPortfolios(newPortfolios, updatedPortfolio);
  }
}