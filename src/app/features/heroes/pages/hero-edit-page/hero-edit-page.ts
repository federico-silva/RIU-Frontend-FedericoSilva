import { Component, inject, signal, DestroyRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HeroService } from '../../../../core/services/hero.service';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  CreateHeroRequest,
  Hero,
  UpdateHeroRequest,
} from '../../../../core/models/hero.models';
import { HeroForm } from '../../components/hero-form/hero-form';

@Component({
  selector: 'app-hero-edit-page',
  imports: [HeroForm],
  templateUrl: './hero-edit-page.html',
  styleUrl: './hero-edit-page.css',
})
export class HeroEditPage implements OnInit {
  private readonly heroService = inject(HeroService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = signal(false);
  readonly hero = signal<Hero | null>(null);

  ngOnInit(): void {
    this.loadHero();
  }

  private loadHero(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) {
            this.router.navigate(['/heroes/list']);
            return of(null);
          }

          const existingHero = this.heroService
            .heroes()
            .find((h) => h.id === id);
          if (existingHero) {
            return of(existingHero);
          }
          return this.heroService.getHeroById(id);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (hero) => {
          this.hero.set(hero);
          if (!hero) {
            this.showError('Hero not found');
            this.router.navigate(['/heroes/list']);
          }
        },
        error: (err) => {
          this.showError('Failed to load hero data');
          this.router.navigate(['/heroes/list']);
        },
      });
  }

  onUpdateHero(heroRequest: CreateHeroRequest | UpdateHeroRequest): void {
    const currentHero = this.hero();
    if (!currentHero) return;

    this.isSubmitting.set(true);

    const updateRequest: UpdateHeroRequest = {
      ...(heroRequest as UpdateHeroRequest),
      id: currentHero.id,
    };

    this.heroService
      .updateHero(updateRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.showSuccess(result.message || 'Hero updated successfully');
            this.router.navigate(['/heroes/list']);
          } else {
            this.showError(result.error || 'Failed to update hero');
          }
        },
        error: (error) => {
          this.showError(
            'An unexpected error occurred while updating the hero'
          );
        },
        complete: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/heroes/list']);
  }

  private showSuccess(message: string): void {
    this.notificationService.success(message);
  }

  private showError(message: string): void {
    this.notificationService.error(message);
  }
}
