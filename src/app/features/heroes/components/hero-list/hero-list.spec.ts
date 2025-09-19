import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroList } from './hero-list';
import { HeroesResponse, Hero } from '../../../../core/models/hero.models';

describe('HeroList', () => {
  let component: HeroList;
  let fixture: ComponentFixture<HeroList>;

  const mockHero: Hero = {
    id: '1',
    name: 'CAPTAIN FIREWALL',
    realName: 'Alice Johnson',
    powers: ['Blocks attacks', 'Generates shields'],
    weaknesses: [],
    effectiveness: 92,
    isAlive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockHeroesResponse: HeroesResponse = {
    data: [mockHero],
    pagination: {
      page: 1,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroList],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroList);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('heroesData', mockHeroesResponse);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Data Rendering', () => {
    it('should display the hero table when data is provided and viewMode is "table"', () => {
      fixture.detectChanges();
      const table = fixture.nativeElement.querySelector('.heroes-table');
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(table).toBeTruthy();
      expect(rows.length).toBe(1);
      expect(fixture.nativeElement.textContent).toContain('CAPTAIN FIREWALL');
    });

    it('should display hero cards when viewMode is set to "cards"', () => {
      component.toggleView('cards');
      fixture.detectChanges();
      
      const cardsContainer = fixture.nativeElement.querySelector('.cards-container');
      const cards = fixture.nativeElement.querySelectorAll('.hero-card');
      expect(cardsContainer).toBeTruthy();
      expect(cards.length).toBe(1);
    });

    it('should display the empty state when no heroes are provided', () => {
      const emptyResponse: HeroesResponse = { ...mockHeroesResponse, data: [], pagination: { ...mockHeroesResponse.pagination, totalItems: 0 } };
      fixture.componentRef.setInput('heroesData', emptyResponse);
      fixture.detectChanges();

      const emptyState = fixture.nativeElement.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
      expect(emptyState.textContent).toContain('No Heroes Found');
    });
  });

  describe('Event Emission', () => {
    beforeEach(() => {
        fixture.detectChanges(); 
    });

    it('should emit addHero event when "Add Hero" button is clicked', () => {
      spyOn(component.addHero, 'emit');
      const addButton = fixture.nativeElement.querySelector('.header-actions button[color="primary"]');
      
      addButton.click();
      
      expect(component.addHero.emit).toHaveBeenCalled();
    });

    it('should emit heroAction with type "edit" when edit button is clicked', () => {
        spyOn(component.heroAction, 'emit');
        const editButton = fixture.nativeElement.querySelector('button[mattooltip="Edit hero"]');
        
        editButton.click();
        
        expect(component.heroAction.emit).toHaveBeenCalledWith({ type: 'edit', hero: mockHero });
    });

    it('should emit pageChange with "next" when next page button is clicked', () => {
        const multiPageResponse = { ...mockHeroesResponse, pagination: { ...mockHeroesResponse.pagination, hasNext: true } };
        fixture.componentRef.setInput('heroesData', multiPageResponse);
        fixture.detectChanges();
        
        spyOn(component.pageChange, 'emit');
        const nextButton = fixture.nativeElement.querySelector('button[mattooltip="Next page"]');
        
        nextButton.click();

        expect(component.pageChange.emit).toHaveBeenCalledWith('next');
    });

    it('should emit pageSizeChange when items per page is changed', () => {
        spyOn(component.pageSizeChange, 'emit');
        const select = fixture.nativeElement.querySelector('.page-size-select') as HTMLSelectElement;
        
        select.value = '25';
        select.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        expect(component.pageSizeChange.emit).toHaveBeenCalledWith(25);
    });
  });

  describe('Internal State and Logic', () => {
    it('should toggle viewMode between "table" and "cards"', () => {
        expect(component.viewMode()).toBe('table');
        
        component.toggleView('cards');
        expect(component.viewMode()).toBe('cards');

        component.toggleView('table');
        expect(component.viewMode()).toBe('table');
    });

    it('should return a correct tooltip string for getMorePowersTooltip', () => {
        const powers = ['Power A', 'Power B'];
        const tooltip = component.getMorePowersTooltip(powers);
        expect(tooltip).toBe('Power A, Power B');
    });
  });
});