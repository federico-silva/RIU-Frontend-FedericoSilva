import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCreatePage } from './hero-create-page';

describe('HeroCreatePage', () => {
  let component: HeroCreatePage;
  let fixture: ComponentFixture<HeroCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroCreatePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
