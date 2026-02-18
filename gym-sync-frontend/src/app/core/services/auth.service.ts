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
}
