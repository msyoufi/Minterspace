import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionModalService {
  public isTransactionModalOpen$ = signal<boolean>(false);

  openTransactionModal(coinId: string): void {
    this.isTransactionModalOpen$.set(true);
  }

  closeTransactionModal(): void {
    this.isTransactionModalOpen$.set(false);
  }
}
