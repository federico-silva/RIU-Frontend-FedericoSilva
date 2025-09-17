import { Injectable, signal } from '@angular/core';
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
      imageUrl: undefined,
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
      imageUrl: undefined,
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
      imageUrl: undefined,
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
      imageUrl: undefined,
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
      imageUrl: undefined,
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
      imageUrl: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  async getAllHeroes(): Promise<Hero[]> {
    const heroes = this.heroes();
    return heroes;
  }
}
