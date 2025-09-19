import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Component, input, output } from '@angular/core';
import { By } from '@angular/platform-browser';

import { HeroCreatePage } from './hero-create-page';
import { HeroService } from '../../../../core/services/hero.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CreateHeroRequest } from '../../../../core/models/hero.models';

@Component({
  selector: 'app-hero-form',
  template: '',
  standalone: true,
})
class MockHeroFormComponent {
  mode = input<'create' | 'edit'>();
  isSubmitting = input<boolean>();
  heroSubmit = output<CreateHeroRequest>();
  formCancel = output<void>();
}

describe('HeroCreatePage', () => {
  let component: HeroCreatePage;
  let fixture: ComponentFixture<HeroCreatePage>;
  let mockHeroService: any;
  let mockNotificationService: any;
  let mockRouter: any;
  let formInstance: MockHeroFormComponent;
  let createHeroSubject: Subject<{ success: boolean; message?: string; error?: string }>;

  beforeEach(async () => {
    createHeroSubject = new Subject();

    mockHeroService = {
      createHero: jasmine.createSpy('createHero').and.returnValue(createHeroSubject.asObservable()),
    };

    mockNotificationService = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [HeroCreatePage, MockHeroFormComponent],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const formDebugElement = fixture.debugElement.query(By.css('app-hero-form'));
    formInstance = formDebugElement.componentInstance as MockHeroFormComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createHero service and navigate on successful form submission', () => {
    const newHero: CreateHeroRequest = { name: 'NEW HERO', powers: ['Test'], effectiveness: 80, isAlive: true, weaknesses: [] };
    
    formInstance.heroSubmit.emit(newHero);
    
    createHeroSubject.next({ success: true, message: 'Hero created successfully' });
    createHeroSubject.complete();
    fixture.detectChanges();

    expect(mockHeroService.createHero).toHaveBeenCalledWith(newHero);
    expect(mockNotificationService.success).toHaveBeenCalledWith('Hero created successfully');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes/list']);
  });

  it('should show an error notification if hero creation fails', () => {
    const newHero: CreateHeroRequest = { name: 'FAIL HERO', powers: ['Test'], effectiveness: 10, isAlive: true, weaknesses: [] };

    formInstance.heroSubmit.emit(newHero);

    createHeroSubject.next({ success: false, error: 'Creation failed' });
    createHeroSubject.complete();
    fixture.detectChanges();

    expect(mockNotificationService.error).toHaveBeenCalledWith('Creation failed');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to the hero list when the form child emits formCancel', () => {
    formInstance.formCancel.emit();
    fixture.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes/list']);
  });

  it('should set isSubmitting to true during creation and false on completion', () => {
    const newHero: CreateHeroRequest = { name: 'TEST HERO', powers: ['Test'], effectiveness: 50, isAlive: true, weaknesses: [] };
    
    expect(component.isSubmitting()).toBe(false);
    
    formInstance.heroSubmit.emit(newHero);
    
    expect(component.isSubmitting()).toBe(true);
    
    createHeroSubject.next({ success: true, message: 'Done' });
    createHeroSubject.complete();
    fixture.detectChanges();
    
    expect(component.isSubmitting()).toBe(false);
  });
});