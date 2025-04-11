import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);

  private user$ = signal<User | null>(null);

  get user(): User | null {
    return this.user$();
  }

  async login(email: string, paaword: string): Promise<any> {


  }

  async signup(email: string, paaword: string): Promise<any> {

  }
}
