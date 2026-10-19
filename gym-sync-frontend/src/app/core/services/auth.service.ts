import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;

  register(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, body);
  }
  login(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, body);
  }

  getUserId(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const user: { userId?: unknown } = JSON.parse(atob(payload));
      return typeof user.userId === 'string' ? user.userId : '';
    } catch {
      return '';
    }
  }

  resendVerificationEmail(login: string): Observable<any> {
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
