import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from './snack-bar.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private snackbar = inject(SnackBarService);

  private BASE_URL = 'http://127.0.0.1:8000/api/portfolio/';

  public portfolios$ = signal<Portfolio[]>([]);
  public currentPortfolio$ = signal<Portfolio | null>(null);

  // The main Portfolio is created on accout creation and cannot be deleted by the user
  public mainPortfolio = computed(() =>
    this.portfolios$().find(pf => pf.is_main) ?? null
  );

  constructor() {
    // effect(() => this.getUserPortfolios());
  }

  getUserPortfolios(): void {
    this.authService.user$()
      ? this.getAllPortfolios()
      : this.setPortfolios([], null);
  }

  async getAllPortfolios(): Promise<void> {
    const portfolios = await this.fetch();
    const mainPortfolio = portfolios.find(pf => pf.is_main) ?? null;

    this.setPortfolios(portfolios, mainPortfolio);
  }

  private async fetch(): Promise<Portfolio[]> {
    try {
      const response$ = this.http.get<Portfolio[]>(this.BASE_URL);
      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.handleError(err);
      return [];
    }
  }

  // async createPortfolio(name: string, is_main = false): Promise<Portfolio | null> {
  //   const createdPortfolio = await this.create({ name, is_main });
  //   if (!createdPortfolio) return null;

  //   const newPortfolios = [...this.Portfolios$(), createdPortfolio];
  //   this.setPortfolios(newPortfolios, createdPortfolio);

  //   return createdPortfolio;
  // }

  // private async create(PortfolioData: Omit<Portfolio, 'coins' | 'id'>): Promise<Portfolio | null> {
  //   try {
  //     const response$ = this.http.post<Portfolio>(this.BASE_URL, PortfolioData);
  //     return await firstValueFrom(response$);

  //   } catch (err: unknown) {
  //     this.handleError(err);
  //     return null;
  //   }
  // }

  // async updatePortfolio(PortfolioId: number | bigint, changes: { name?: string, coins?: string[] }): Promise<Portfolio | null> {
  //   if (!changes.coins && !changes.name)
  //     return null;

  //   const updatedPortfolio = await this.update(PortfolioId, changes);
  //   if (!updatedPortfolio) return null;

  //   const newPortfolios = this.Portfolios$().map(wl =>
  //     wl.id === PortfolioId ? updatedPortfolio : wl
  //   );

  //   this.setPortfolios(newPortfolios, updatedPortfolio);

  //   return updatedPortfolio;
  // }

  // private async update(PortfolioId: number | bigint, changes: { name?: string, coins?: string[] }): Promise<Portfolio | null> {
  //   try {
  //     const response$ = this.http.patch<Portfolio>(this.BASE_URL + PortfolioId, changes);
  //     return await firstValueFrom(response$);

  //   } catch (err: unknown) {
  //     this.handleError(err);
  //     return null;
  //   }
  // }

  // async deletePortfolio(PortfolioId: number | bigint): Promise<boolean> {
  //   if (PortfolioId === this.mainPortfolio()?.id)
  //     return false;

  //   const result = await this.delete(PortfolioId);
  //   if (!result) return false;

  //   const newPortfolios = this.Portfolios$().filter(wl => wl.id !== PortfolioId);
  //   this.setPortfolios(newPortfolios, this.mainPortfolio());

  //   return true;
  // }

  // private async delete(PortfolioId: number | bigint): Promise<boolean> {
  //   try {
  //     const response$ = this.http.delete<null>(this.BASE_URL + PortfolioId);
  //     await firstValueFrom(response$);

  //     return true;

  //   } catch (err: unknown) {
  //     this.handleError(err);
  //     return false;
  //   }
  // }

  private setPortfolios(all: Portfolio[], current: Portfolio | null): void {
    this.portfolios$.set(all);
    this.currentPortfolio$.set(current);
  }

  public setCurrentPortfolioById(id: number | bigint): void {
    const portfolio = this.portfolios$().find(pf => pf.id === id) ?? null;
    this.currentPortfolio$.set(portfolio);
  }

  private handleError(err: unknown): void {
    let message = 'An unexpected error occurred.';

    if (err instanceof HttpErrorResponse) {
      const error = err.error;

      if (typeof error?.detail === 'string') {
        message = error.detail;

      } else if (typeof error === 'object') {
        const firstError = Object.values(error).flat()[0];

        message = typeof firstError === 'string'
          ? firstError
          : `HTTP Error: ${err.status} - ${err.statusText}`;

      } else if (typeof error === 'string') {
        message = error;

      } else {
        message = `HTTP Error: ${err.status} - ${err.statusText}`;
      }

    } else if (err instanceof Error) {
      message = err.message;
    }

    this.snackbar.show(message, 'red', 5000);
  }
}
