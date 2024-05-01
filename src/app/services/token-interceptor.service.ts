import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { ApiEndpoint } from '../helper/api-endpoint';
import { catchError, throwError, Observable, EMPTY, switchMap } from 'rxjs';
import { Routes } from '../helper/routes';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router)

  if (!ApiEndpoint.isPostLogin(request.url) || !request.url.startsWith('http') ) {
    return next(request);
  }

  const accessToken = authService.getAccessToken();
  if (accessToken) {
    request = addTokenToRequest(request, accessToken);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        return handleTokenRefresh(request, next, authService, router);
      } else {
        return throwError(() => new Error())
      }
    })
  );

}

const addTokenToRequest = (request: HttpRequest<any>, token: string): HttpRequest<any> => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

const handleTokenRefresh = (request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService, router: Router): Observable<HttpEvent<any>> => {
  return authService.refreshAccessToken().pipe(
    catchError((error: any) => {
      console.log(error);
      authService.logout();
      router.navigateByUrl(Routes.Login, { replaceUrl: true });
      return EMPTY;
    }),
    switchMap(() => {
      const newAccessToken = authService.getAccessToken();
      request = addTokenToRequest(request, newAccessToken);
      return next(request);
    })
  );
}