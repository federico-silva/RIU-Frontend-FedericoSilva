import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { HeroesResponse } from '../../../../core/models/hero.models';

@Component({
  selector: 'app-hero-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatMenuModule,
  ],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.css',
  
})
export class HeroList {
  readonly heroesData = input.required<HeroesResponse>();
  readonly isLoading = input<boolean>(false);
  readonly hasFilters = input<boolean>(false);

  readonly pageChange = output<'next' | 'previous'>();
  readonly pageSizeChange = output<number>();

  readonly viewMode = signal<'table' | 'cards'>('table');
  readonly displayedColumns = [
    'avatar',
    'name',
    'powers',
    'effectiveness',
    'status',
    'actions',
  ];

  readonly resultsRange = computed(() => {
    const data = this.heroesData();
    const start = (data.pagination.page - 1) * data.pagination.pageSize + 1;
    const end = Math.min(
      start + data.data.length - 1,
      data.pagination.totalItems
    );
    return { start, end };
  });

  onHeroAction(): void {}

  onPageChange(direction: 'next' | 'previous'): void {
    this.pageChange.emit(direction);
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const pageSize = parseInt(select.value);
    this.pageSizeChange.emit(pageSize);
  }

  toggleView(mode: 'table' | 'cards'): void {
    this.viewMode.set(mode);
  }

  getMorePowersTooltip(remainingPowers: string[]): string {
    return remainingPowers.join(', ');
  }

  getMoreWeaknessesTooltip(remainingWeaknesses: string[]): string {
    return remainingWeaknesses.join(', ');
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'images/not_image.png';
  }
}
