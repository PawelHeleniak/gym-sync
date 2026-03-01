import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userId: string = '';

  constructor(private http: HttpClient) {
    const storage = localStorage.getItem('user');
    if (storage) this.userId = storage;
  }
  private baseUrl = environment.apiUrl;

  register(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, body);
  }
  login(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, body);
  }

  getUserId() {
    this.getLocalStorage();
    return this.userId;
  }

  getLocalStorage() {
    const storage = localStorage.getItem('user');
    if (storage) this.userId = storage;
  }

  resendVerificationEmail(login?: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/resendVerificationEmail`, {
      login,
    });
  }

  confirmAccount(token: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/confirmAccount`, {
      token,
    });
  }
}
