import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { HeroService } from '../../../../core/services/hero.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Hero } from '../../../../core/models/hero.models';
import { HeroListPage } from './hero-list-page';

const MOCK_HERO: Hero = {
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
};

describe('HeroListPage', () => {
  let component: HeroListPage;
  let fixture: ComponentFixture<HeroListPage>;

  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', [
      'loadHeroes',
      'setSearchTerm',
      'nextPage',
      'previousPage',
      'setPageSize',
      'deleteHero',
    ]);

    (mockHeroService as any).searchTerm = signal('');
    (mockHeroService as any).paginatedHeroes = signal({
      data: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      },
    });

    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [HeroListPage],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockMatDialog },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    mockHeroService.loadHeroes.and.returnValue(of([]));

    mockMatDialog.open.and.returnValue({
      afterClosed: () => of(false),
    } as any);

    fixture = TestBed.createComponent(HeroListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadHeroes on initialization', () => {
    expect(mockHeroService.loadHeroes).toHaveBeenCalled();
  });

  it('should navigate to create hero page on onAddHero', () => {
    component.onAddHero();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes/create']);
  });

  it('should navigate to view hero page on onHeroAction "view"', () => {
    component.onHeroAction({ type: 'view', hero: MOCK_HERO });
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/heroes/view',
      MOCK_HERO.id,
    ]);
  });

  it('should navigate to edit hero page on onHeroAction "edit"', () => {
    component.onHeroAction({ type: 'edit', hero: MOCK_HERO });
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/heroes/edit',
      MOCK_HERO.id,
    ]);
  });

  it('should call handleDeleteHero on onHeroAction "delete"', () => {
    spyOn(component as any, 'handleDeleteHero').and.callThrough();
    component.onHeroAction({ type: 'delete', hero: MOCK_HERO });
    expect((component as any).handleDeleteHero).toHaveBeenCalledWith(MOCK_HERO);
  });

  it('should call setSearchTerm on onFiltersChange', () => {
    const searchTerm = 'captain';
    component.onFiltersChange(searchTerm);
    expect(mockHeroService.setSearchTerm).toHaveBeenCalledWith(searchTerm);
  });

  it('should call nextPage on onPageChange "next"', () => {
    component.onPageChange('next');
    expect(mockHeroService.nextPage).toHaveBeenCalled();
  });

  it('should call previousPage on onPageChange "previous"', () => {
    component.onPageChange('previous');
    expect(mockHeroService.previousPage).toHaveBeenCalled();
  });

  it('should call setPageSize on onPageSizeChange', () => {
    const pageSize = 5;
    component.onPageSizeChange(pageSize);
    expect(mockHeroService.setPageSize).toHaveBeenCalledWith(pageSize);
  });

  describe('handleDeleteHero', () => {
    it('should delete hero and show success notification when confirmed', fakeAsync(() => {
      mockMatDialog.open.and.returnValue({
        afterClosed: () => of(true),
      } as any);
      mockHeroService.deleteHero.and.returnValue(
        of({ success: true, message: 'Success!' })
      );

      (component as any).handleDeleteHero(MOCK_HERO);
      tick();

      expect(mockMatDialog.open).toHaveBeenCalled();
      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(MOCK_HERO.id);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Success!');
    }));

    it('should not delete hero if dialog is cancelled', fakeAsync(() => {
      mockMatDialog.open.and.returnValue({
        afterClosed: () => of(false),
      } as any);

      (component as any).handleDeleteHero(MOCK_HERO);
      tick();

      expect(mockHeroService.deleteHero).not.toHaveBeenCalled();
      expect(mockNotificationService.success).not.toHaveBeenCalled();
      expect(mockNotificationService.error).not.toHaveBeenCalled();
    }));

    it('should show error notification if deletion fails', fakeAsync(() => {
      mockMatDialog.open.and.returnValue({
        afterClosed: () => of(true),
      } as any);
      mockHeroService.deleteHero.and.returnValue(
        of({ success: false, error: 'Failed!' })
      );

      (component as any).handleDeleteHero(MOCK_HERO);
      tick();

      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(MOCK_HERO.id);
      expect(mockNotificationService.error).toHaveBeenCalledWith('Failed!');
    }));

    it('should show unexpected error notification if service throws an error', fakeAsync(() => {
      mockMatDialog.open.and.returnValue({
        afterClosed: () => of(true),
      } as any);
      mockHeroService.deleteHero.and.returnValue(
        throwError(() => new Error('Network Error'))
      );

      (component as any).handleDeleteHero(MOCK_HERO);
      tick();

      expect(mockNotificationService.error).toHaveBeenCalledWith(
        'An unexpected error occurred'
      );
    }));
  });
});
