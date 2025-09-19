import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroCard } from './hero-card';
import { Hero } from '../../../../core/models/hero.models';

const mockHero: Hero = {
  id: '1',
  name: 'CAPTAIN FIREWALL',
  realName: 'Alice Johnson',
  powers: ['Blocks attacks', 'Generates shields', 'Firewall', 'Antivirus'],
  weaknesses: ['SQL Injection', 'Social Engineering', 'Phishing'],
  effectiveness: 92,
  isAlive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('HeroCard', () => {
  let component: HeroCard;
  let fixture: ComponentFixture<HeroCard>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('hero', mockHero);

    fixture.detectChanges();
    nativeElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Data Display', () => {
    it('should display hero name and real name', () => {
      const title = nativeElement.querySelector('.hero-card-title');
      const subtitle = nativeElement.querySelector('mat-card-subtitle');

      expect(title?.textContent).toContain(mockHero.name);
      expect(subtitle?.textContent).toContain(mockHero.realName!);
    });

    it('should display the correct status chip for an alive hero', () => {
      const statusChip = nativeElement.querySelector('.status-chip');
      expect(statusChip).toHaveClass('status-alive');
      expect(statusChip).not.toHaveClass('status-dead');
      expect(statusChip?.textContent).toContain('favorite');
    });

    it('should display the correct status chip for a deceased hero', () => {
      const deadHero = { ...mockHero, isAlive: false };
      fixture.componentRef.setInput('hero', deadHero);
      fixture.detectChanges();

      const statusChip = nativeElement.querySelector('.status-chip');
      expect(statusChip).toHaveClass('status-dead');
      expect(statusChip).not.toHaveClass('status-alive');
      expect(statusChip?.textContent).toContain('heart_broken');
    });

    it('should display effectiveness progress bar and percentage', () => {
      const percentage = nativeElement.querySelector(
        '.effectiveness-percentage'
      );
      expect(percentage?.textContent).toContain(`${mockHero.effectiveness}%`);
    });

    it('should display powers with a "more" chip', () => {
      const powerChips = nativeElement.querySelectorAll(
        '.card-powers .power-chip'
      );
      const moreChip = nativeElement.querySelector('.card-powers .more-chip');

      expect(powerChips.length).toBe(3);
      expect(moreChip?.textContent).toContain('+1');
    });
  });

  describe('Event Emissions', () => {
    let heroActionSpy: jasmine.Spy;

    beforeEach(() => {
      heroActionSpy = spyOn(component.heroAction, 'emit');
    });

    it('should emit a "view" action when the card is clicked', () => {
      nativeElement.querySelector<HTMLElement>('.hero-card')?.click();
      fixture.detectChanges();
      expect(heroActionSpy).toHaveBeenCalledOnceWith({
        type: 'view',
        hero: mockHero,
      });
    });

    it('should emit a "view" action when the View button is clicked', () => {
      const viewButton = nativeElement.querySelector<HTMLButtonElement>(
        'button[color="primary"]'
      );
      viewButton?.click();
      fixture.detectChanges();
      expect(heroActionSpy).toHaveBeenCalledOnceWith({
        type: 'view',
        hero: mockHero,
      });
    });

    it('should emit an "edit" action when the Edit button is clicked', () => {
      const editButton = nativeElement.querySelector<HTMLButtonElement>(
        'button[color="accent"]'
      );
      editButton?.click();
      fixture.detectChanges();
      expect(heroActionSpy).toHaveBeenCalledOnceWith({
        type: 'edit',
        hero: mockHero,
      });
    });

    it('should emit a "delete" action when the Delete button is clicked', () => {
      const deleteButton = nativeElement.querySelector<HTMLButtonElement>(
        'button[color="warn"]'
      );
      deleteButton?.click();
      fixture.detectChanges();
      expect(heroActionSpy).toHaveBeenCalledOnceWith({
        type: 'delete',
        hero: mockHero,
      });
    });

    it('should stop event propagation when an action button is clicked', () => {
      const mockEvent = new MouseEvent('click');
      spyOn(mockEvent, 'stopPropagation');

      component.onHeroAction('edit', mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(heroActionSpy).toHaveBeenCalledWith({
        type: 'edit',
        hero: mockHero,
      });
    });
  });
});
