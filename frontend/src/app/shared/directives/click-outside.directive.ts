import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[msClickOutside]'
})
export class ClickOutsideDirective {
  elementRef = inject(ElementRef);
  msClickOutside = output<void>();

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement): void {
    if (!this.elementRef.nativeElement.contains(targetElement))
      this.msClickOutside.emit();
  }
}
