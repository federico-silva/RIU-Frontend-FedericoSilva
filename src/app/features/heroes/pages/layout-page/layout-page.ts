import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { PageConfig } from '../../../../core/models/common.models';
import { CardHeader } from '../../components/card-header/card-header';

@Component({
  selector: 'app-layout-page',
  imports: [CardHeader, RouterOutlet],
  templateUrl: './layout-page.html',
  styleUrl: './layout-page.css',
})
export class LayoutPage {
  private readonly router = inject(Router);
  private readonly currentRoute = signal<string>('');
  private readonly pageConfigs: Record<string, PageConfig> = {
    '/heroes/list': {
      title: 'Heroes Management',
      subtitle: 'Manage your superhero roster',
      icon: 'local_police',
      showAddButton: true,
    },
    '/heroes/create': {
      title: 'Create New Hero',
      subtitle: 'Add a new superhero to your roster',
      icon: 'add_circle',
      showAddButton: false,
    },
    '/heroes/edit': {
      title: 'Edit Hero',
      subtitle: 'Modify hero information and abilities',
      icon: 'edit',
      showAddButton: false,
    },
    '/heroes/view': {
      title: 'Hero Details',
      subtitle: 'View complete hero information',
      icon: 'visibility',
      showAddButton: false,
    },
  };

  readonly currentPageConfig = computed(() => {
    const route = this.currentRoute();

    if (route.startsWith('/heroes/edit/')) {
      return this.pageConfigs['/heroes/edit'];
    }
    if (route.startsWith('/heroes/view/')) {
      return this.pageConfigs['/heroes/view'];
    }
    return (
      this.pageConfigs[route] || {
        title: 'Heroes',
        subtitle: 'Hero management system',
        icon: 'local_police',
        showAddButton: false,
      }
    );
  });

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => (event as NavigationEnd).url),
        takeUntilDestroyed()
      )
      .subscribe((url) => {
        this.currentRoute.set(url);
      });

    this.currentRoute.set(this.router.url);
  }

  navigateToCreate(): void {
    this.router.navigate(['/heroes/create']);
  }
}
