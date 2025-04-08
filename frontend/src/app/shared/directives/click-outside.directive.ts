import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[msClickOutside]'
})
export class ClickOutsideDirective {
  elementRef = inject(ElementRef);
  msClickOutside = output<void>();

  @HostListener('document:mousedown', ['$event.target'])
  onMousedown(targetElement: HTMLElement): void {
    if (!this.elementRef.nativeElement.contains(targetElement))
      this.msClickOutside.emit();
  }
}
