import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { EscapePressDirective } from '../../shared/directives/escape-press.directive';
import { TransactionModalService } from '../../shared/services/transaction-modal.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TransactionService } from '../../shared/services/transaction.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import MsValidators from '../../shared/utils/ms.validators';
import { Router } from '@angular/router';
import { PortfolioService } from '../../shared/services/portfolio.service';

interface TransctionFormValues {
  coinId: string,
  type: 'buy' | 'sell',
  quantity: number,
  coinPrice_usd: number,
  date: string,
  time: string
};

@Component({
  selector: 'ms-transaction-form-modal',
  imports: [ClickOutsideDirective, EscapePressDirective, ReactiveFormsModule, MatProgressSpinner, CommonModule],
  templateUrl: './transaction-form-modal.component.html',
  styleUrl: './transaction-form-modal.component.scss'
})
export class TransactionFormModalComponent {
  portfolioService = inject(PortfolioService);
  transactionService = inject(TransactionService);
  transactionModalService = inject(TransactionModalService);
  router = inject(Router);
  snackbar = inject(SnackBarService);
  destoryRef = inject(DestroyRef);

  isLoading = signal(false);
  totalCost = signal(0);

  form = new FormGroup({
    coinId: new FormControl('', Validators.required),
    type: new FormControl<'buy' | 'sell'>('buy', Validators.required),
    quantity: new FormControl<number | null>(null, [Validators.required, MsValidators.greaterThanZero]),
    coinPrice_usd: new FormControl<number | null>(null, [Validators.required, MsValidators.greaterThanZero]),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required)
  });

  constructor() {
    effect(() => this.onCoinLoaded());
    this.onValueChanges();
  }

  onCoinLoaded(): void {
    const coin = this.transactionModalService.selectedCoin();
    if (!coin) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    this.form.patchValue({
      coinId: coin.id,
      coinPrice_usd: coin.current_price,
      date: dateStr,
      time: timeStr
    });
  }

  onValueChanges(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe(value => {
        const { quantity, coinPrice_usd } = value;

        const newTotal = quantity && coinPrice_usd
          ? quantity * coinPrice_usd
          : 0;

        this.totalCost.set(newTotal);
      });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading.set(true);

    const transaction = this.createTransaction(this.form.value as TransctionFormValues);
    if (!transaction) return;

    const newTransaction = await this.transactionService.createTransaction(transaction);

    this.isLoading.set(false);

    if (!newTransaction) return;

    if (this.router.url.includes('portfolio'))
      this.portfolioService.getPortfolioDataById(newTransaction.portfolio_id);

    this.transactionModalService.closeModal();
    this.snackbar.show('Transaction Added', 'green');
  }

  createTransaction(values: TransctionFormValues): Omit<Transaction, 'id'> | null {
    const portfolioId = this.transactionModalService.selectedPortfolioId();
    if (!portfolioId) return null;

    const { type, quantity, coinPrice_usd, coinId, date, time } = values;

    const timeWithSeconds = time.length === 5 ? `${time}:00` : time;
    const dateISOString = `${date}T${timeWithSeconds}`;

    return {
      portfolio_id: portfolioId,
      coin_id: coinId,
      type,
      quantity,
      coin_price_usd: coinPrice_usd,
      date: dateISOString
    };
  }

  closeModal(): void {
    this.transactionModalService.closeModal();
  }
}