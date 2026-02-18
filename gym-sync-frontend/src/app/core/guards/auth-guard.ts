import { CanActivateFn, Router } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';

import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthGuardService);
  const router = inject(Router);

  if (authService.user()) return true;

  return router.createUrlTree(['/autoryzacja']);
};
