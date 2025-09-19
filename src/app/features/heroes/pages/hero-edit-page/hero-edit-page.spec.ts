import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HeroService } from '../../../../core/services/hero.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Hero } from '../../../../core/models/hero.models';

import { HeroEditPage } from './hero-edit-page';

describe('HeroEditPage', () => {
  let component: HeroEditPage;
  let fixture: ComponentFixture<HeroEditPage>;

  let mockHeroService: any;
  let mockRouter: any;
  let mockNotificationService: any;

  const testHero: Hero = {
    id: '1',
    name: 'CAPTAIN FIREWALL',
    realName: 'Alice Johnson',
    powers: ['Blocks malicious attacks'],
    effectiveness: 92,
    weaknesses: ['Cannot stop physical breaches'],
    isAlive: true,
    imageUrl: 'https://fake.url/hero.png',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockHeroService = {
      getHeroById: jasmine.createSpy('getHeroById').and.returnValue(of(testHero)),
      heroes: signal([testHero]),
      updateHero: jasmine.createSpy('updateHero').and.returnValue(
        of({ success: true, message: 'Hero updated successfully' })
      ),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    mockNotificationService = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
    };

    await TestBed.configureTestingModule({
      imports: [HeroEditPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: '1' })) },
        },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load hero on init', () => {
    expect(component.hero()).toEqual(testHero);
  });

  it('should call updateHero and navigate on successful update', () => {
    component.hero.set(testHero);

    const updateRequest = { ...testHero, name: 'UPDATED HERO' };

    component.onUpdateHero(updateRequest);

    expect(mockHeroService.updateHero).toHaveBeenCalledWith(jasmine.objectContaining({ id: testHero.id }));
    expect(mockNotificationService.success).toHaveBeenCalledWith('Hero updated successfully');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes/list']);
  });

  it('should show error when updateHero fails', () => {
    mockHeroService.updateHero.and.returnValue(of({ success: false, error: 'Update failed' }));
    component.hero.set(testHero);

    component.onUpdateHero(testHero);

    expect(mockNotificationService.error).toHaveBeenCalledWith('Update failed');
  });

  it('should handle unexpected error when updating hero', () => {
    mockHeroService.updateHero.and.returnValue(throwError(() => new Error('Unexpected')));
    component.hero.set(testHero);

    component.onUpdateHero(testHero);

    expect(mockNotificationService.error).toHaveBeenCalledWith(
      'An unexpected error occurred while updating the hero'
    );
  });

  it('should navigate back to list on cancel', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes/list']);
  });
});
