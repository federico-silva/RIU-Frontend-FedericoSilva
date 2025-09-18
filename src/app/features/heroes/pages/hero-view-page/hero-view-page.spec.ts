import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroViewPage } from './hero-view-page';

describe('HeroViewPage', () => {
  let component: HeroViewPage;
  let fixture: ComponentFixture<HeroViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroViewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
