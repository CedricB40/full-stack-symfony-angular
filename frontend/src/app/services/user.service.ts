import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
  registeredAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private api = 'https://127.0.0.1:8000/api/users';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  addUser(name: string, email: string): Observable<User> {
    return this.http.post<User>(this.api, { name, email });
  }

  updateUser(id: number, name: string, email: string): Observable<User> {
    return this.http.patch<User>(`${this.api}/${id}`, { name, email });
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}
