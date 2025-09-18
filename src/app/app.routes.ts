import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/heroes',
    pathMatch: 'full'
  },
  {
    path: 'heroes',
    loadChildren: () => 
      import('./features/heroes/heroes.routes').then(r => r.heroesRoutes),
    title: 'Heroes'
  },
  {
    path: '**',
    redirectTo: '/heroes'
  }
];