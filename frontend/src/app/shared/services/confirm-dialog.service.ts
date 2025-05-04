import { Dialog, DialogRef, } from '@angular/cdk/dialog';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);

  async open(data: DialogData): Promise<boolean | undefined> {
    const dialogRef: DialogRef<boolean | undefined, ConfirmDialogComponent> =
      this.dialog.open(ConfirmDialogComponent, { data });

    const source = dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef))
    return await firstValueFrom(source);
  }
}