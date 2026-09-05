import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000/users';

  login(email: string) {
    return this.http.get<any[]>(`${this.api}?email=${encodeURIComponent(email)}`);
  }
}