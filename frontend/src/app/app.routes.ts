import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';



export const routes = [

  {
  path: '',
  redirectTo: 'login',
  pathMatch: 'full' as const
},

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];