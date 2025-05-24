import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'ms-confirm-dialog',
  imports: [],
  template: `
    <p class="title">{{title}}</p>
    <p class="message">{{message}}</p>
    <div>
      <button type="button" class="ms-button red-button" (click)="dialogRef.close(true)">
        {{actionButton}}
      </button>
      <button type="button" class="ms-button secondary"(click)="dialogRef.close(false)">Cancel</button>
    </div>
  `,
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  title = '';
  message = '';
  actionButton = 'Confirm';

  constructor(
    public dialogRef: DialogRef<boolean, undefined>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {
    this.title = data.title;
    this.message = data.message;
    this.actionButton = data.actionButton;
  }
}