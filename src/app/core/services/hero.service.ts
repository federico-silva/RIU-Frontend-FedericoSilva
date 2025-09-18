import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, catchError, tap, of, map } from 'rxjs';

import { DataStorageService } from './data-storage.service';
import {
  CreateHeroRequest,
  Hero,
  HeroesResponse,
  HeroState,
} from '../models/hero.models';
import { ApiResponse, PaginationParams } from '../models/common.models';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly dataService = inject(DataStorageService);

  private readonly _state = signal<HeroState>({
    heroes: [],
    selectedHero: null,
    searchTerm: '',
    isLoading: false,
    error: null,
  });

  private readonly _pagination = signal<PaginationParams>({
    page: 1,
    pageSize: 10,
  });

  readonly state = this._state.asReadonly();
  readonly pagination = this._pagination.asReadonly();

  readonly heroes = computed(() => this._state().heroes);
  readonly selectedHero = computed(() => this._state().selectedHero);
  readonly searchTerm = computed(() => this._state().searchTerm);
  readonly error = computed(() => this._state().error);

  readonly filteredHeroes = computed(() => {
    const heroes = this.heroes();
    const searchTerm = this.searchTerm().trim();

    if (!searchTerm) return heroes;

    const term = searchTerm.toLowerCase();
    return heroes.filter(
      (hero) =>
        hero.name.toLowerCase().includes(term) ||
        hero.realName?.toLowerCase().includes(term)
    );
  });

  readonly paginatedHeroes = computed((): HeroesResponse => {
    const filtered = this.filteredHeroes();
    const { page, pageSize } = this.pagination();
    const startIndex = (page - 1) * pageSize;
    const data = filtered.slice(startIndex, startIndex + pageSize);
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  });

  loadHeroes(): Observable<Hero[]> {
    this.setError(null);
    return this.dataService.getAllHeroes().pipe(
      tap((heroes) => this.updateHeroes(heroes)),
      catchError((error) => {
        this.setError('Error loading heroes');
        return of([]);
      })
    );
  }

  getHeroById(id: string): Observable<Hero | null> {
    return this.dataService.getHeroById(id).pipe(
      tap((hero) => this.selectHero(hero)),
      catchError(() => of(null))
    );
  }

  createHero(request: CreateHeroRequest): Observable<ApiResponse<Hero>> {
    const validation = this.validateHeroRequest(request);
    if (!validation.isValid) {
      return of({ success: false, error: validation.error! });
    }
    this.setError(null);

    const heroData = {
      ...request,
      name: request.name.toUpperCase(),
    };

    return this.dataService.createHero(heroData).pipe(
      tap((hero) => this.addHero(hero)),
      map(
        (hero) =>
          ({
            success: true,
            data: hero,
            message: 'Hero created successfully',
          } as ApiResponse<Hero>)
      ),
      catchError((error) => {
        this.setError('Error creating hero');
        return of({
          success: false,
          error: 'Error creating hero',
        } as ApiResponse<Hero>);
      })
    );
  }

  deleteHero(id: string): Observable<ApiResponse<boolean>> {
    this.setError(null);

    return this.dataService.deleteHero(id).pipe(
      map((result) => {
        if (result === true) {
          this.removeHero(id);
          return {
            success: true,
            data: true,
            message: 'Hero deleted successfully',
          } as ApiResponse<boolean>;
        }
        return {
          success: false,
          error: 'Failed to delete hero',
        } as ApiResponse<boolean>;
      }),
      catchError((error) => {
        this.setError('Error deleting hero');
        return of({
          success: false,
          error: 'Error deleting hero',
        } as ApiResponse<boolean>);
      })
    );
  }

  searchHeroes(searchTerm: string): Observable<Hero[]> {
    return this.dataService.searchHeroes(searchTerm);
  }

  setSearchTerm(searchTerm: string): void {
    this._state.update((state) => ({ ...state, searchTerm }));
    this.goToPage(1);
  }

  clearSearch(): void {
    this.setSearchTerm('');
  }

  goToPage(page: number): void {
    const current = this.paginatedHeroes();
    if (page >= 1 && page <= current.pagination.totalPages) {
      this._pagination.update((p) => ({ ...p, page }));
    }
  }

  nextPage(): void {
    const current = this.paginatedHeroes();
    if (current.pagination.hasNext) {
      this.goToPage(current.pagination.page + 1);
    }
  }

  previousPage(): void {
    const current = this.paginatedHeroes();
    if (current.pagination.hasPrevious) {
      this.goToPage(current.pagination.page - 1);
    }
  }

  setPageSize(pageSize: number): void {
    this._pagination.update((p) => ({ ...p, pageSize, page: 1 }));
  }

  selectHero(hero: Hero | null): void {
    this._state.update((state) => ({ ...state, selectedHero: hero }));
  }

  private setError(error: string | null): void {
    this._state.update((state) => ({ ...state, error }));
  }

  private addHero(hero: Hero): void {
    this._state.update((state) => ({
      ...state,
      heroes: [...state.heroes, hero],
    }));
  }

  private updateHeroes(heroes: Hero[]): void {
    this._state.update((state) => ({ ...state, heroes }));
  }

  private removeHero(id: string): void {
    this._state.update((state) => ({
      ...state,
      heroes: state.heroes.filter((h) => h.id !== id),
      selectedHero: state.selectedHero?.id === id ? null : state.selectedHero,
    }));
  }

  private validateHeroRequest(request: CreateHeroRequest): {
    isValid: boolean;
    error?: string;
  } {
    if (!request.name?.trim()) {
      return { isValid: false, error: 'Hero name is required' };
    }

    if (request.effectiveness < 1 || request.effectiveness > 100) {
      return {
        isValid: false,
        error: 'Effectiveness must be between 1 and 100',
      };
    }

    if (!request.powers?.length) {
      return { isValid: false, error: 'Hero must have at least one power' };
    }

    const existingHero = this.heroes().find(
      (h) => h.name.toLowerCase() === request.name.toLowerCase()
    );

    if (existingHero) {
      return { isValid: false, error: 'A hero with this name already exists' };
    }

    return { isValid: true };
  }
}
