import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { HeroService } from '../../../../core/services/hero.service';
import { Hero } from '../../../../core/models/hero.models';

import { HeroViewPage } from './hero-view-page';

describe('HeroViewPage', () => {
  let component: HeroViewPage;
  let fixture: ComponentFixture<HeroViewPage>;

  let mockHeroService: Partial<HeroService>;
  let mockRouter: Partial<Router>;
  const testHero: Hero = {
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

  beforeEach(async () => {
    mockHeroService = {
      getHeroById: (id) => of(testHero),
      heroes: signal([testHero]),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [HeroViewPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
          },
        },
        {
          provide: HeroService,
          useValue: mockHeroService,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
