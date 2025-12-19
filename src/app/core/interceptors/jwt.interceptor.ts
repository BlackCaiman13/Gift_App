import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Lire directement depuis localStorage pour éviter les problèmes de timing avec les signals
  const token = localStorage.getItem('auth_token');

  // Ne pas ajouter le token pour les requêtes de login et register
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  return next(req);
};
