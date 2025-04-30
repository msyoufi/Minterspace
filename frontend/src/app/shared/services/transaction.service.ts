import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ErrorService } from './error.service';
import { PortfolioService } from './portfolio.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private portfolioService = inject(PortfolioService);
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  private BASE_URL = 'http://127.0.0.1:8000/api/portfolio/transaction/';

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<boolean> {
    const { portfolio_id, ...transactionData } = transaction;
    const url = this.BASE_URL + portfolio_id;

    try {
      const response$ = this.http.post<PortfolioData>(url, transactionData);
      const newPortfolioData = await firstValueFrom(response$);

      this.portfolioService.currentPortfolioData$.set(newPortfolioData);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }

  async deleteTransaction(portfolioId: number | bigint, transactionId: number | bigint): Promise<boolean> {
    const url = this.BASE_URL + portfolioId + '/' + transactionId;

    try {
      const response$ = this.http.delete<PortfolioData>(url);
      const newPortfolioData = await firstValueFrom(response$);

      this.portfolioService.currentPortfolioData$.set(newPortfolioData);

      return true;

    } catch (err: unknown) {
      this.errorService.handleError(err);
      return false;
    }
  }
}