import { Routes } from '@angular/router';

export const heroesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/layout-page/layout-page').then(c => c.LayoutPage),
    title: 'Heroes Management',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./pages/hero-list-page/hero-list-page').then(c => c.HeroListPage),
        title: 'Heroes List'
      }
    ]
  }
];