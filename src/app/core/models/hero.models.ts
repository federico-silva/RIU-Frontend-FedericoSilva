import { PaginatedResponse } from './common.models';

export interface Hero {
  id: string;
  name: string;
  realName?: string;
  powers: string[];
  effectiveness: number;
  weaknesses: string[];
  isAlive: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHeroRequest {
  name: string;
  realName?: string;
  powers: string[];
  effectiveness: number;
  weaknesses: string[];
  isAlive: boolean;
  imageUrl?: string;
}
export interface UpdateHeroRequest extends Partial<CreateHeroRequest> {
  id: string;
}

export type HeroesResponse = PaginatedResponse<Hero>;

export interface HeroState {
  heroes: Hero[];
  selectedHero: Hero | null;
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
}

export interface HeroAction {
  type: 'edit' | 'delete' | 'view';
  hero: Hero;
}

export type FormMode = 'create' | 'edit';
