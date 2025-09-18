import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HeroService } from '../../../../core/services/hero.service';
import { HeroDetail } from '../../components/hero-detail/hero-detail';
import { Hero } from '../../../../core/models/hero.models';

@Component({
  selector: 'app-hero-view-page',
  imports: [
    CommonModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    HeroDetail,
  ],
  templateUrl: './hero-view-page.html',
  styleUrl: './hero-view-page.css',
})
export class HeroViewPage implements OnInit {
  private readonly heroService = inject(HeroService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

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
      .subscribe((hero) => {
        this.hero.set(hero);
        if (!hero) {
          this.router.navigate(['/heroes/list']);
        }
      });
  }
}
