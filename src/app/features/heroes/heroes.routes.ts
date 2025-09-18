import { Routes } from '@angular/router';

export const heroesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/layout-page/layout-page').then((c) => c.LayoutPage),
    title: 'Heroes Management',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./pages/hero-list-page/hero-list-page').then(
            (c) => c.HeroListPage
          ),
        title: 'Heroes List',
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/hero-create-page/hero-create-page').then(
            (c) => c.HeroCreatePage
          ),
        title: 'Create Hero',
      },
      {
        path: 'view/:id',
        loadComponent: () =>
          import('./pages/hero-view-page/hero-view-page').then(
            (c) => c.HeroViewPage
          ),
        title: 'Hero Details',
      },
    ],
  },
];
