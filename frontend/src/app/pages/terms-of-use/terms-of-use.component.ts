import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { fromEvent, map, throttleTime } from 'rxjs';

@Component({
  selector: 'ms-terms-of-use',
  imports: [RouterLink],
  templateUrl: './terms-of-use.component.html',
  styleUrl: './terms-of-use.component.scss'
})
export class TermsOfUseComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  showScrollButton = signal(false);

  ngOnInit(): void {
    fromEvent<Event>(window, 'scroll')
      .pipe(
        throttleTime(100),
        map(() => window.scrollY || window.pageYOffset || document.documentElement.scrollTop),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((scrollTop) => this.showScrollButton.set(scrollTop > 300));
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
