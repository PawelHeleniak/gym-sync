import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const userInterceptor: HttpInterceptorFn = (req, next) => {
  const token = window.localStorage.getItem('token');
  const router = inject(Router);
  console.log(token);
  if (!token) return next(req);
  const modifiedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem('token');
        router.navigate(['/autoryzacja']);
      }

      return throwError(() => error);
    }),
  );
};
