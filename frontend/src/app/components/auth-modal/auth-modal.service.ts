import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  private isModalOpen$ = new Subject<boolean>();
  public isModalOpen = this.isModalOpen$.asObservable();

  forwardURL = '';

  open(forwardURL: string): void {
    this.isModalOpen$.next(true);
    this.forwardURL = forwardURL;
  }

  close(): void {
    this.isModalOpen$.next(false);
    this.forwardURL = '';
  }
}
