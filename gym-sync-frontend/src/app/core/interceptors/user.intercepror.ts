import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const userInterceptor: HttpInterceptorFn = (req, next) => {
  const token = window.localStorage.getItem('token');
  console.log(token);
  if (!token) return next(req);
  const modifiedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(modifiedReq);
};
