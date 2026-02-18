import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  user(): boolean {
    const pass = false;
    return pass;
  }
}
