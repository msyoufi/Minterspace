import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[msEscapePress]'
})
export class EscapePressDirective {
  elementRef = inject(ElementRef);
  msEscapePress = output<void>();

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape')
      this.msEscapePress.emit();
  }
}
