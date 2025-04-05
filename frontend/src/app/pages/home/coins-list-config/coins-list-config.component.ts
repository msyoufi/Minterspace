import { Component, DestroyRef, inject, OnInit, viewChild } from '@angular/core';
import { CoingeckoService } from '../../../shared/services/coingecko.service';
import { FormsModule, NgForm } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ConfigForm {
  categoryId: string,
  perPage: string
}

@Component({
  selector: 'ms-coins-list-config',
  imports: [FormsModule],
  templateUrl: './coins-list-config.component.html',
  styleUrl: './coins-list-config.component.scss'
})
export class CoinsListConfigComponent implements OnInit {
  coinService = inject(CoingeckoService);
  destroyRef = inject(DestroyRef);

  form = viewChild.required<NgForm>('formRef');

  ngOnInit() {
    this.subscribeToFormChanges();
  }

  subscribeToFormChanges(): void {
    this.form().valueChanges
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.onFormChange(this.form().value));
  }

  onFormChange(configs: ConfigForm): void {
    console.log(configs)
  }
}
