import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from './error.service';
import { PortfolioService } from './portfolio.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private portfolioService = inject(PortfolioService);
  private errorService = inject(ErrorService);

  private BASE_URL = 'http://127.0.0.1:8000/api/portfolio';

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction | null> {
    const { portfolio_id, ...transactionData } = transaction;
    const url = `${this.BASE_URL}/transaction/${portfolio_id}`;

    try {
      const response$ = this.http.post<Transaction>(url, transactionData);
      
      this.sendMustFetchSignal();

      return await firstValueFrom(response$);

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return null;
    }
  }

  async deleteTransaction(portfolioId: number | bigint, transactionId: number | bigint): Promise<boolean> {
    const url = `${this.BASE_URL}/transaction/${portfolioId}/${transactionId}`;
    return await this.delete(url);
  }

  async deleteAsset(portfolioId: number | bigint, coinId: string): Promise<boolean> {
    const url = `${this.BASE_URL}/asset/${portfolioId}/${coinId}`;
    return await this.delete(url);
  }

  private async delete(url: string): Promise<boolean> {
    try {
      const response$ = this.http.delete<null>(url);
      await firstValueFrom(response$);

      this.sendMustFetchSignal();

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  private sendMustFetchSignal(): void {
    this.portfolioService.mustFetchNewData.set(true);
  }
}