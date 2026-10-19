import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  user(): boolean {
    const token = localStorage.getItem('token');
    if (!token || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) {
      return false;
    }

    try {
      const header: { alg?: unknown } | null = JSON.parse(
        atob(token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')),
      );
      if (!header || typeof header.alg !== 'string' || !header.alg || header.alg === 'none') {
        return false;
      }
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const user: { userId?: unknown; exp?: unknown; nbf?: unknown } | null =
        JSON.parse(atob(payload));
      const now = Date.now() / 1000;

      return !!user &&
        typeof user.userId === 'string' && user.userId.trim().length > 0 &&
        typeof user.exp === 'number' && Number.isFinite(user.exp) && user.exp > now &&
        (user.nbf === undefined ||
          (typeof user.nbf === 'number' && Number.isFinite(user.nbf) && user.nbf <= now));
    } catch {
      return false;
    }
  }
}
