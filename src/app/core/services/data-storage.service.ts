import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Hero } from '../models/hero.models';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private heroes = signal<Hero[]>([
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
    {
      id: '3',
      name: 'LADY ENCRYPTION',
      realName: 'Sofia Martínez',
      powers: [
        'Encrypts data with unbreakable algorithms',
        'Generates one-time passcodes',
      ],
      effectiveness: 97,
      weaknesses: ['Users forgetting their keys'],
      isAlive: true,
      imageUrl:
        'https://res.cloudinary.com/djh3gcq2q/image/upload/v1758146806/lady_encryption_uwkgvf.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: 'BUG HUNTER',
      realName: 'Daniel OConnor',
      powers: ['Detects vulnerabilities instantly', 'Neutralizes malware'],
      effectiveness: 88,
      weaknesses: ['Easily distracted by puzzles'],
      isAlive: true,
      imageUrl:
        'https://res.cloudinary.com/djh3gcq2q/image/upload/v1758146806/bug_hunter_acwdps.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      name: 'CLOUD RIDER',
      realName: 'Mina Chen',
      powers: [
        'Spins up servers in seconds',
        'Balances workloads automatically',
      ],
      effectiveness: 90,
      weaknesses: ['Latency storms'],
      isAlive: true,
      imageUrl:
        'https://res.cloudinary.com/djh3gcq2q/image/upload/v1758146807/cloud_rider_kjdv8j.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      name: 'THE PATCHER',
      realName: 'Igor Petrov',
      powers: ['Heals broken systems', 'Upgrades outdated code silently'],
      effectiveness: 85,
      weaknesses: [
        'Legacy systems that refuse updates',
        'Reboots slow him down',
      ],
      isAlive: true,
      imageUrl:
        'https://res.cloudinary.com/djh3gcq2q/image/upload/v1758146806/the_patcher_wcdm0v.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  private simulateDelay<T>(data: T): Observable<T> {
    const delayTime = Math.random() * 800 + 200;
    return of(data).pipe(delay(delayTime));
  }

  getAllHeroes(): Observable<Hero[]> {
    return this.simulateDelay(this.heroes());
  }

  getHeroById(id: string): Observable<Hero | null> {
    const hero = this.heroes().find((h) => h.id === id) || null;
    return this.simulateDelay(hero);
  }

  searchHeroes(searchTerm: string): Observable<Hero[]> {
    if (!searchTerm.trim()) {
      return this.simulateDelay(this.heroes());
    }

    const term = searchTerm.toLowerCase();
    const results = this.heroes().filter(
      (hero) =>
        hero.name.toLowerCase().includes(term) ||
        hero.realName?.toLowerCase().includes(term)
    );

    return this.simulateDelay(results);
  }
}
