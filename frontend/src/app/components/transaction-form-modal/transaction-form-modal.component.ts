import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { EscapePressDirective } from '../../shared/directives/escape-press.directive';
import { TransactionModalService } from '../../shared/services/transaction-modal.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import MsValidators from '../../shared/utils/ms.validators';

@Component({
  selector: 'ms-transaction-form-modal',
  imports: [ClickOutsideDirective, EscapePressDirective, ReactiveFormsModule, MatProgressSpinner, CommonModule],
  templateUrl: './transaction-form-modal.component.html',
  styleUrl: './transaction-form-modal.component.scss'
})
export class TransactionFormModalComponent {
  transactionModalService = inject(TransactionModalService);
  destoryRef = inject(DestroyRef);

  isLoading = signal(false);
  totalCost = signal(0);

  form = new FormGroup({
    type: new FormControl<'buy' | 'sell'>('buy', Validators.required),
    quantity: new FormControl<number | null>(null, [Validators.required, MsValidators.greaterThanZero]),
    pricePerCoin: new FormControl<number | null>(null, [Validators.required, MsValidators.greaterThanZero]),
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
      pricePerCoin: coin.current_price,
      date: dateStr,
      time: timeStr
    });
  }

  onValueChanges(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe(value => {
        const { quantity, pricePerCoin } = value;

        const newTotal = quantity && pricePerCoin
          ? quantity * pricePerCoin
          : 0;

        this.totalCost.set(newTotal);
      });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading.set(true);

    console.log(this.form.value);

    this.isLoading.set(false);
  }

  closeModal(): void {
    this.transactionModalService.closeModal();
  }
}
