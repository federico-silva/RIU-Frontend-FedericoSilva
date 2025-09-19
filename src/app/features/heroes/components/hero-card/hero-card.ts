import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Hero, HeroAction } from '../../../../core/models/hero.models';

@Component({
  selector: 'app-hero-card',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  templateUrl: './hero-card.html',
  styleUrl: './hero-card.css'
})
export class HeroCard {
  readonly hero = input.required<Hero>();
  readonly heroAction = output<HeroAction>();

  onHeroAction(type: 'view' | 'edit' | 'delete', event: Event): void {
    event.stopPropagation();
    this.heroAction.emit({ type, hero: this.hero() });
  }

  onCardClick(): void {
    this.heroAction.emit({ type: 'view', hero: this.hero() });
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