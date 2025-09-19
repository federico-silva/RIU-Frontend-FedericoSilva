import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { HeroFilter } from './hero-filter';

describe('HeroFilter', () => {
  let component: HeroFilter;
  let fixture: ComponentFixture<HeroFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroFilter, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFilter);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with an empty search term by default', () => {
      fixture.detectChanges();
      expect(component.searchControl.value).toBe('');
    });

    it('should initialize with the provided initialSearchTerm', () => {
      const initialTerm = 'Captain';
      fixture.componentRef.setInput('initialSearchTerm', initialTerm);

      fixture.detectChanges();

      expect(component.searchControl.value).toBe(initialTerm);
    });
  });

  describe('Search Term Emission', () => {
    it('should emit the search term after 300ms debounce time', fakeAsync(() => {
      spyOn(component.searchTermChange, 'emit');
      fixture.detectChanges();

      component.searchControl.setValue('Captain');
      tick(299);
      expect(component.searchTermChange.emit).not.toHaveBeenCalled();
      tick(1);
      expect(component.searchTermChange.emit).toHaveBeenCalledWith('Captain');
    }));

    it('should not emit if the value is the same as the previous one', fakeAsync(() => {
      spyOn(component.searchTermChange, 'emit');
      fixture.detectChanges();

      component.searchControl.setValue('Code');
      tick(300);
      expect(component.searchTermChange.emit).toHaveBeenCalledTimes(1);

      component.searchControl.setValue('Code');
      tick(300);

      expect(component.searchTermChange.emit).toHaveBeenCalledTimes(1);
    }));

    it('should trim whitespace before emitting', fakeAsync(() => {
      spyOn(component.searchTermChange, 'emit');
      fixture.detectChanges();

      component.searchControl.setValue('  Captain  ');
      tick(300);

      expect(component.searchTermChange.emit).toHaveBeenCalledWith('Captain');
    }));
  });

  describe('clearFilter Method', () => {
    it('should clear the search input when clearFilter is called', () => {
      fixture.detectChanges();
      component.searchControl.setValue('Captain');

      component.clearFilter();

      expect(component.searchControl.value).toBe('');
    });

    it('should emit an empty string when the filter is cleared', fakeAsync(() => {
      spyOn(component.searchTermChange, 'emit');
      fixture.detectChanges();
      component.searchControl.setValue('Captain');
      tick(300); 
      component.clearFilter();
      tick(300);

      expect(component.searchTermChange.emit).toHaveBeenCalledWith('');
      expect(component.searchTermChange.emit).toHaveBeenCalledTimes(2);
    }));
  });
});
