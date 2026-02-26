import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { UserData } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;

  getUser(): Observable<UserData> {
    return this.http.get<UserData>(`${this.baseUrl}/auth/getUser`);
  }
  updatePassword(password: string, newPassword: string): Observable<void> {
    const body = {
      password,
      newPassword,
    };

    return this.http.patch<any>(`${this.baseUrl}/auth/updatePassword`, body);
  }
  updateEmail(email: string, newEmail: string): Observable<any[]> {
    const body = {
      email,
      newEmail,
    };
    return this.http.post<any>(`${this.baseUrl}/auth/requestEmailChange`, body);
  }
  confirmEmail(code: string): Observable<any[]> {
    const body = { code };
    return this.http.post<any>(`${this.baseUrl}/auth/confirmEmailChange`, body);
  }
}
