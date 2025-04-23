import { Routes } from '@angular/router';
import { ErrorStateGuard } from '../pages/error/404/404.guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'error/404',
    loadComponent: () =>
      import('../pages/error/404/404.component').then(
        (m) => m.NotFoundPage
      ),
    canActivate: [ErrorStateGuard],
  },
  {
    path: 'error/500',
    loadComponent: () =>
      import('../pages/error/500/500.component').then(
        (m) => m.InternalErrorPage
      ),
  },
];
