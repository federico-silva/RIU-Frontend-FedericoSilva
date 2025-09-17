import { inject, Injectable } from '@angular/core';
import { DataStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly dataStorageService = inject(DataStorageService);

  async loadAllHeroes(): Promise<void> {
    try {
      const heroes = await this.dataStorageService.getAllHeroes();
    } catch (error) {
      console.error('Error loading heroes:', error);
      throw error;
    }
  }
}
