import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

describe('AuthService user identity', () => {
  const service = new AuthService({} as HttpClient);

  function tokenFor(userId: string, issuedAt: number): string {
    const payload = btoa(JSON.stringify({ userId, iat: issuedAt }))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `header.${payload}.signature`;
  }

  it('uses the same user ID across different login tokens', () => {
    const storage = spyOn(localStorage, 'getItem');
    storage.and.returnValue(tokenFor('user-a', 1));
    expect(service.getUserId()).toBe('user-a');
    storage.and.returnValue(tokenFor('user-a', 2));
    expect(service.getUserId()).toBe('user-a');
    storage.and.returnValue(tokenFor('user-b', 3));
    expect(service.getUserId()).toBe('user-b');
  });

  it('returns no user ID for missing, malformed or incomplete tokens', () => {
    const storage = spyOn(localStorage, 'getItem');
    storage.and.returnValue(null);
    expect(service.getUserId()).toBe('');
    storage.and.returnValue('invalid');
    expect(service.getUserId()).toBe('');
    storage.and.returnValue(`header.${btoa('{}')}.signature`);
    expect(service.getUserId()).toBe('');
  });
});
