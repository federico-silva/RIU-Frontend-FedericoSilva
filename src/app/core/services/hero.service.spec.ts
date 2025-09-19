import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HeroService } from './hero.service';
import { DataStorageService } from './data-storage.service';
import { LoadingService } from './loading.service';
import { Hero } from '../models/hero.models';

describe('HeroService', () => {
  let service: HeroService;
  let mockDataStorageService: jasmine.SpyObj<DataStorageService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  const mockHeroes: Hero[] = [
    {
      id: '1',
      name: 'CAPTAIN FIREWALL',
      realName: 'Alice Johnson',
      powers: [
        'Blocks malicious attacks',
        'Generates protective shields',
        'Monitors digital traffic in real-time',
      ],
      effectiveness: 92,
      weaknesses: ['Cannot stop physical breaches'],
      isAlive: true,
      imageUrl:
        'https://res.cloudinary.com/djh3gcq2q/image/upload/v1758146806/captain_firewall_owrg6f.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'CODEMASTER',
      realName: 'Raj Patel',
      powers: [
        'Writes flawless code instantly',
        'Debugs errors by touch',
        'Optimizes legacy systems',
      ],
      effectiveness: 95,
      weaknesses: ['Overconfidence in algorithms'],
      isAlive: true,
      imageUrl:
        'https://res.cloudinary.com/djh3gcq2q/image/upload/v1758146806/codemaster_asamrw.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    const dataSpy = jasmine.createSpyObj('DataStorageService', [
      'getAllHeroes',
      'createHero',
      'deleteHero',
    ]);
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        HeroService,
        { provide: DataStorageService, useValue: dataSpy },
        { provide: LoadingService, useValue: loadingSpy },
      ],
    });

    service = TestBed.inject(HeroService);
    mockDataStorageService = TestBed.inject(
      DataStorageService
    ) as jasmine.SpyObj<DataStorageService>;
    mockLoadingService = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
  });

  it('should be created with initial state', () => {
    expect(service).toBeTruthy();
    expect(service.heroes()).toEqual([]);
    expect(service.pagination()).toEqual({ page: 1, pageSize: 10 });
  });

  describe('loadHeroes', () => {
    it('should load heroes and update the state on success', () => {
      mockDataStorageService.getAllHeroes.and.returnValue(of(mockHeroes));
      service.loadHeroes().subscribe();

      expect(mockLoadingService.show).toHaveBeenCalled();
      expect(mockDataStorageService.getAllHeroes).toHaveBeenCalled();
      expect(service.heroes()).toEqual(mockHeroes);
      expect(mockLoadingService.hide).toHaveBeenCalled();
      expect(service.error()).toBeNull();
    });

    it('should set an error state on failure', () => {
      mockDataStorageService.getAllHeroes.and.returnValue(
        throwError(() => new Error('Failed to fetch'))
      );
      service.loadHeroes().subscribe();

      expect(service.error()).toBe('Error loading heroes');
      expect(service.heroes()).toEqual([]);
    });
  });

  describe('createHero', () => {
    it('should not create a hero if validation fails (duplicate name)', () => {
      mockDataStorageService.getAllHeroes.and.returnValue(of(mockHeroes));
      service.loadHeroes().subscribe();

      const newHeroRequest = {
        name: 'CAPTAIN FIREWALL',
        powers: ['Power'],
        effectiveness: 100,
        weaknesses: [],
        isAlive: true,
      };

      service.createHero(newHeroRequest).subscribe((response) => {
        expect(response.success).toBe(false);
        expect(response.error).toBe('A hero with this name already exists');
      });

      expect(mockDataStorageService.createHero).not.toHaveBeenCalled();
    });

    it('should add a hero to the state on successful creation', () => {
      const newHeroRequest = {
        name: 'LADY ENCRYPTION',
        powers: ['Encrypts data'],
        effectiveness: 97,
        weaknesses: [],
        isAlive: true,
      };
      const createdHero: Hero = {
        id: '3',
        ...newHeroRequest,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDataStorageService.createHero.and.returnValue(of(createdHero));
      service.createHero(newHeroRequest).subscribe();

      expect(mockDataStorageService.createHero).toHaveBeenCalled();
      expect(service.heroes().length).toBe(1);
      expect(service.heroes()[0].name).toBe('LADY ENCRYPTION');
    });
  });

  describe('Pagination and Filtering', () => {
    beforeEach(() => {
      mockDataStorageService.getAllHeroes.and.returnValue(of(mockHeroes));
      service.loadHeroes().subscribe();
    });

    it('should filter heroes based on search term', () => {
      expect(service.filteredHeroes().length).toBe(2);
      service.setSearchTerm('captain');
      expect(service.filteredHeroes().length).toBe(1);
      expect(service.filteredHeroes()[0].name).toBe('CAPTAIN FIREWALL');
    });

    it('should paginate filtered heroes', () => {
      service.setPageSize(1);
      service.setSearchTerm('');

      let paginated = service.paginatedHeroes();
      expect(paginated.data.length).toBe(1);
      expect(paginated.data[0].name).toBe('CAPTAIN FIREWALL');
      expect(paginated.pagination.totalPages).toBe(2);

      service.nextPage();
      paginated = service.paginatedHeroes();

      expect(paginated.data.length).toBe(1);
      expect(paginated.data[0].name).toBe('CODEMASTER');
    });

    it('should reset to page 1 when search term changes', () => {
      service.setPageSize(1);
      service.nextPage();
      expect(service.pagination().page).toBe(2);

      service.setSearchTerm('CODE');
      expect(service.pagination().page).toBe(1);
    });
  });
});
