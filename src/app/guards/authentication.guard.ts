import { CanActivateFn, Router } from '@angular/router';
import { Routes } from '../helper/routes';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  
  const router: Router = inject(Router)
  const authService: AuthService = inject(AuthService);
  const isAuthenticated = authService.getAccessToken()

  if (isAuthenticated) {          
    return true;
  } else {          
    router.navigateByUrl(Routes.Login, { replaceUrl: true })
    return false;
  }

};
