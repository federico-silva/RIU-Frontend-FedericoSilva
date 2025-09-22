import { TestBed } from '@angular/core/testing';
import { DataStorageService } from './data-storage.service';;

describe('DataStorageService', () => {
  let service: DataStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataStorageService],
    });
    service = TestBed.inject(DataStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllHeroes', () => {
    it('should return all heroes', (done: DoneFn) => {
      service.getAllHeroes().subscribe((heroes) => {
        expect(heroes).toBeDefined();
        expect(heroes.length).toBe(6);
        expect(heroes[0].name).toBe('CAPTAIN FIREWALL');
        done();
      });
    });

    it('should return heroes with required properties', (done: DoneFn) => {
      service.getAllHeroes().subscribe((heroes) => {
        const hero = heroes[0];
        expect(hero.id).toBeDefined();
        expect(hero.name).toBeDefined();
        expect(hero.powers).toBeDefined();
        expect(hero.effectiveness).toBeDefined();
        done();
      });
    });
  });

  describe('getHeroById', () => {
    it('should return hero when found', (done: DoneFn) => {
      service.getHeroById('1').subscribe((hero) => {
        expect(hero).toBeDefined();
        expect(hero!.id).toBe('1');
        expect(hero!.name).toBe('CAPTAIN FIREWALL');
        done();
      });
    });

    it('should return null when hero not found', (done: DoneFn) => {
      service.getHeroById('nonexistent').subscribe((hero) => {
        expect(hero).toBeNull();
        done();
      });
    });
  });

  describe('searchHeroes', () => {
    it('should return all heroes when search is empty', (done: DoneFn) => {
      service.searchHeroes('').subscribe((heroes) => {
        expect(heroes.length).toBe(6);
        done();
      });
    });

    it('should search by hero name', (done: DoneFn) => {
      service.searchHeroes('captain').subscribe((heroes) => {
        expect(heroes.length).toBe(1);
        expect(heroes[0].name).toBe('CAPTAIN FIREWALL');
        done();
      });
    });

    it('should return empty array when no matches', (done: DoneFn) => {
      service.searchHeroes('nonexistent').subscribe((heroes) => {
        expect(heroes.length).toBe(0);
        done();
      });
    });
  });

  describe('createHero', () => {
    const newHeroData = {
      name: 'TEST HERO',
      realName: 'Test User',
      powers: ['Test power'],
      effectiveness: 85,
      weaknesses: ['Test weakness'],
      isAlive: true,
      imageUrl: 'test-url.png',
    };

    it('should create a new hero', (done: DoneFn) => {
      service.createHero(newHeroData).subscribe((newHero) => {
        expect(newHero.id).toBeDefined();
        expect(newHero.name).toBe(newHeroData.name);
        expect(newHero.effectiveness).toBe(newHeroData.effectiveness);
        expect(newHero.createdAt).toBeInstanceOf(Date);
        done();
      });
    });

    it('should add hero to the list', (done: DoneFn) => {
      service.createHero(newHeroData).subscribe(() => {
        service.getAllHeroes().subscribe((heroes) => {
          expect(heroes.length).toBe(7);
          done();
        });
      });
    });
  });

  describe('updateHero', () => {
    it('should update existing hero', (done: DoneFn) => {
      const updateData = {
        name: 'UPDATED CAPTAIN',
        effectiveness: 95,
      };

      service.updateHero('1', updateData).subscribe((updatedHero) => {
        expect(updatedHero.id).toBe('1');
        expect(updatedHero.name).toBe('UPDATED CAPTAIN');
        expect(updatedHero.effectiveness).toBe(95);
        done();
      });
    });

    it('should throw error when hero not found', (done: DoneFn) => {
      service.updateHero('nonexistent', {}).subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error.message).toBe('Hero not found');
          done();
        },
      });
    });
  });

  describe('deleteHero', () => {
    it('should delete existing hero', (done: DoneFn) => {
      service.deleteHero('1').subscribe((result) => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should throw error when hero not found', (done: DoneFn) => {
      service.deleteHero('nonexistent').subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error.message).toBe('Hero not found');
          done();
        },
      });
    });
  });

  describe('basic operations', () => {
    it('should create and then find hero', (done: DoneFn) => {
      const heroData = {
        name: 'NEW HERO',
        powers: ['New power'],
        effectiveness: 80,
        weaknesses: [],
        isAlive: true,
      };

      service.createHero(heroData).subscribe((createdHero) => {
        service.getHeroById(createdHero.id).subscribe((foundHero) => {
          expect(foundHero!.name).toBe('NEW HERO');
          done();
        });
      });
    });
  });
});