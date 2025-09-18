import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { HeroList } from '../../components/hero-list/hero-list';
import { HeroFilter } from '../../components/hero-filter/hero-filter';
import { ConfirmDialog } from '../../../../shared/confirm-dialog/confirm-dialog';
import { HeroService } from '../../../../core/services/hero.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Hero, HeroAction } from '../../../../core/models/hero.models';
import { ConfirmDialogData } from '../../../../core/models/confirm-dialog.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-list-page',
  imports: [CommonModule, HeroList, HeroFilter],
  templateUrl: './hero-list-page.html',
  styleUrl: './hero-list-page.css',
})
export class HeroListPage {
  public readonly heroService = inject(HeroService);
  private readonly notificationService = inject(NotificationService);

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  private readonly isDeleting = signal(false);

  readonly hasActiveFilters = computed(() => !!this.heroService.searchTerm());

  ngOnInit(): void {
    this.loadHeroes();
  }

  onAddHero(): void {
    this.router.navigate(['/heroes/create']);
  }

  onHeroAction(action: HeroAction): void {
    switch (action.type) {
      case 'view':
        this.router.navigate(['/heroes/view', action.hero.id]);
        break;
      case 'delete':
        this.handleDeleteHero(action.hero);
        break;
    }
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

  private async handleDeleteHero(hero: Hero): Promise<void> {
    if (this.isDeleting()) return;

    const confirmed = await this.confirmDelete(hero);
    if (!confirmed) return;

    this.isDeleting.set(true);
    this.heroService
      .deleteHero(hero.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.showSuccess(result.message || 'Hero deleted successfully');
          } else {
            this.showError(result.error || 'Failed to delete hero');
          }
        },
        error: () => {
          this.showError('An unexpected error occurred');
        },
        complete: () => {
          this.isDeleting.set(false);
        },
      });
  }

  private async confirmDelete(hero: Hero): Promise<boolean> {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Hero',
      message: `Are you sure you want to delete "${hero.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
    };

    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: dialogData,
      maxWidth: '400px',
      disableClose: true,
    });

    return await firstValueFrom(
      dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef))
    );
  }

  private showSuccess(message: string): void {
    this.notificationService.success(message);
  }

  private showError(message: string): void {
    this.notificationService.error(message);
  }
}
