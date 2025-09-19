import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { HeroList } from './hero-list';
import { HeroesResponse } from '../../../../core/models/hero.models';

describe('HeroList', () => {
  let component: HeroList;
  let fixture: ComponentFixture<HeroList>;

  const mockHeroesResponse: HeroesResponse = {
    data: [
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
    ],
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

    Object.defineProperty(component, 'heroesData', {
      writable: true,
      value: signal(mockHeroesResponse),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
