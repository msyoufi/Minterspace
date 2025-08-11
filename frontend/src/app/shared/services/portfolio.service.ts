import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, firstValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { ErrorService } from './error.service';
import API_URL from '../../../secrets/api-url';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  private BASE_URL = API_URL + '/portfolio/';

  public portfolios$ = signal<Portfolio[]>([]);
  public currentPortfolio$ = signal<Portfolio | null>(null);
  public currentPortfolioId$ = computed<number | bigint>(() => this.currentPortfolio$()?.id ?? 0);
  public isFetching = signal(false);

  // The main Portfolio is created on accout creation and cannot be deleted by the user
  public mainPortfolio = computed(() =>
    this.portfolios$().find(pf => pf.is_main) ?? null
  );

  public fetchNewData = new BehaviorSubject<number | bigint>(0);

  constructor() {
    effect(() => this.getUserPortfolios());
    effect(() => this.onPortfolioIdChange());
  }

  private getUserPortfolios(): void {
    this.authService.user$()
      ? this.getAllPortfoliosMetadata()
      : this.setPortfolios([], null);
  }

  private async getAllPortfoliosMetadata(): Promise<void> {
    const portfolios = await this.fetchPortfoliosMetadata();
    const mainPortfolio = portfolios.find(pf => pf.is_main) ?? null;

    this.setPortfolios(portfolios, mainPortfolio);
  }

  private async fetchPortfoliosMetadata(): Promise<Portfolio[]> {
    try {
      const response$ = this.http.get<Portfolio[]>(this.BASE_URL)
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return [];
    }
  }

  private onPortfolioIdChange(): void {
    const id = this.currentPortfolioId$();
    this.getPortfolioDataById(id);
  }

  fetchPortfolioDataObservable(): Observable<PortfolioData | EmptyPortfolio> {
    return this.fetchNewData.pipe(
      filter(portfolioId => portfolioId > 0),
      tap(() => this.isFetching.set(true)),
      switchMap(portfolioId =>
        this.http.get<PortfolioData | null>(this.BASE_URL + 'data/' + portfolioId).pipe(
          map((res: PortfolioData | null) =>
            res ? res : { id: portfolioId }
          ),
          tap(res => {
            this.isFetching.set(false);
            this.syncLocalPortfolioCoins(res);
          }),
          catchError((err: unknown) => {
            this.errorService.handleError(err);
            return of({ id: portfolioId });
          }))));
  }

  private syncLocalPortfolioCoins(newData: PortfolioData | EmptyPortfolio): void {
    const { id } = newData;
    const changedPortfolio = this.portfolios$().find(pf => pf.id === id);
    if (!changedPortfolio) return;

    const newCoins: string[] = 'assets' in newData
      ? Object.keys(newData.transactions_by_coin)
      : [];

    if (newCoins.length === changedPortfolio.coins.length)
      return;

    const updatedPortfolio = { ...changedPortfolio, coins: newCoins };
    const newPortfolios = this.portfolios$().map(pf => pf.id === id ? updatedPortfolio : pf);

    this.portfolios$.set(newPortfolios);

    if (this.currentPortfolio$()?.id === id)
      this.currentPortfolio$.set(updatedPortfolio);
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

  public getPortfolioDataById(portfolioId: number | bigint): void {
    this.fetchNewData.next(portfolioId);
  }

  public setCurrentPortfolioById(id: number | bigint): void {
    const portfolio = this.portfolios$().find(pf => pf.id === id) ?? null;
    this.currentPortfolio$.set(portfolio);
  }
}