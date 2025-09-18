import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { HeroList } from '../../components/hero-list/hero-list';
import { HeroFilter } from '../../components/hero-filter/hero-filter';
import { HeroService } from '../../../../core/services/hero.service';

@Component({
  selector: 'app-hero-list-page',
  imports: [CommonModule, HeroList, HeroFilter],
  templateUrl: './hero-list-page.html',
  styleUrl: './hero-list-page.css',
})
export class HeroListPage {
  public readonly heroService = inject(HeroService);
  private readonly destroyRef = inject(DestroyRef);

  readonly hasActiveFilters = computed(() => !!this.heroService.searchTerm());

  ngOnInit(): void {
    this.loadHeroes();
  }

  loadHeroes(): void {
    this.heroService
      .loadHeroes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  onFiltersChange(searchTerm: string): void {
    this.heroService.setSearchTerm(searchTerm);
  }

  onPageChange(direction: 'next' | 'previous'): void {
    if (direction === 'next') {
      this.heroService.nextPage();
    } else {
      this.heroService.previousPage();
    }
  }

  onPageSizeChange(pageSize: number): void {
    this.heroService.setPageSize(pageSize);
  }
}
