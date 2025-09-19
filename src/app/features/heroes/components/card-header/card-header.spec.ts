import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core'; 
import { PageConfig } from '../../../../core/models/common.models';

import { CardHeader } from './card-header';

describe('CardHeader', () => {
  let component: CardHeader;
  let fixture: ComponentFixture<CardHeader>;

  const mockConfig: PageConfig = {
    title: 'Test Title',
    subtitle: 'This is a test subtitle',
    icon: 'home',
    showAddButton: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(CardHeader);
    component = fixture.componentInstance;

    Object.defineProperty(component, 'config', {
      writable: true,
      value: signal(mockConfig),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});