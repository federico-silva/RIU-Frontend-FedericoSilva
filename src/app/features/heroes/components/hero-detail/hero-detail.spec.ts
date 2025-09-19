import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Hero } from '../../../../core/models/hero.models';

import { HeroDetail } from './hero-detail';

describe('HeroDetail', () => {
  let component: HeroDetail;
  let fixture: ComponentFixture<HeroDetail>;

  const mockHero: Hero = {
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
    await TestBed.configureTestingModule({
      imports: [HeroDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetail);
    component = fixture.componentInstance;

    Object.defineProperty(component, 'hero', {
      writable: true,
      value: signal(mockHero),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
