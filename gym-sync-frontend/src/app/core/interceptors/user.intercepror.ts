import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const userInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const userId = authService.getUserId();

  if (!userId) return next(req);

  const modifiedReq = req.clone({
    params: req.params.set('userId', userId),
  });

  return next(modifiedReq);
};
