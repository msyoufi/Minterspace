import { Component, ElementRef, input, OnInit, output, viewChild } from '@angular/core';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';
import { EscapePressDirective } from '../../../shared/directives/escape-press.directive';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'ms-name-input-pane',
  imports: [ClickOutsideDirective, EscapePressDirective, FormsModule, MatProgressSpinner],
  templateUrl: './name-input-pane.component.html',
  styleUrl: './name-input-pane.component.scss'
})
export class NameInputPaneComponent implements OnInit {
  isLoading = input.required<boolean>();
  object = input.required<string>();
  formActionType = input.required<'create' | 'edit'>();

  nameSubmit = output<string>();
  paneClose = output<void>();

  nameInput = viewChild.required<ElementRef<HTMLInputElement>>('nameInput');

  ngOnInit(): void {
    this.nameInput()?.nativeElement.focus();
  }

  onSubmit(name: string): void {
    this.nameSubmit.emit(name);
  }

  onPaneClose(): void {
    this.paneClose.emit();
  }
}
