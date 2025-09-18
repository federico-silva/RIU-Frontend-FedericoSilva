import { Component, inject, signal, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HeroService } from '../../../../core/services/hero.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { HeroForm } from '../../components/hero-form/hero-form';
import { CreateHeroRequest } from '../../../../core/models/hero.models';

@Component({
  selector: 'app-hero-create-page',
  imports: [HeroForm],
  templateUrl: './hero-create-page.html',
  styleUrl: './hero-create-page.css',
})
export class HeroCreatePage {
  private readonly heroService = inject(HeroService);
  private readonly notificationService = inject(NotificationService);
  
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = signal(false);

  onCreateHero(heroRequest: CreateHeroRequest): void {
    this.isSubmitting.set(true);

    this.heroService
      .createHero(heroRequest as CreateHeroRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.showSuccess(result.message || 'Hero created successfully');
            this.router.navigate(['/heroes/list']);
          } else {
            this.showError(result.error || 'Failed to create hero');
          }
        },
        error: (error) => {
          this.showError(
            'An unexpected error occurred while creating the hero'
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
