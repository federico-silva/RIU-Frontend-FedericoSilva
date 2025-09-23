import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { HeroForm } from './hero-form';
import { Hero } from '../../../../core/models/hero.models';

describe('HeroForm', () => {
  let component: HeroForm;
  let fixture: ComponentFixture<HeroForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroForm, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroForm);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when in Create Mode', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    describe('Name FormControl', () => {
      it('should be invalid if empty (required validator)', () => {
        const nameControl = component.heroForm.get('name');
        nameControl?.setValue('');
        expect(nameControl?.valid).toBe(false);
      });

      it('should be invalid if too short (minLength validator)', () => {
        const nameControl = component.heroForm.get('name');
        nameControl?.setValue('a');
        expect(nameControl?.valid).toBe(false);
      });

      it('should be valid with a correct name', () => {
        const nameControl = component.heroForm.get('name');
        nameControl?.setValue('SuperCode');
        expect(nameControl?.valid).toBe(true);
      });
    });

    describe('RealName FormControl', () => {
      it('should be invalid if it contains numbers (lettersOnly validator)', () => {
        const realNameControl = component.heroForm.get('realName');
        realNameControl?.setValue('Clark Kent 123');
        expect(realNameControl?.valid).toBe(false);
      });

      it('should be valid with only letters and spaces', () => {
        const realNameControl = component.heroForm.get('realName');
        realNameControl?.setValue('Clark Kent');
        expect(realNameControl?.valid).toBe(true);
      });
    });

    describe('Powers FormArray', () => {
      it('should be invalid if it has no powers (minLength validator)', () => {
        expect(component.powersArray.length).toBe(0);
        expect(component.heroForm.valid).toBe(false);
      });

      it('should add a power correctly', () => {
        component.powerControl.setValue('Debugs');
        component.addPower();
        expect(component.powersArray.length).toBe(1);
        expect(component.powersArray.at(0).value).toBe('Debugs');
      });

      it('should not add a duplicate power', () => {
        component.powerControl.setValue('Debugs');
        component.addPower();
        component.powerControl.setValue('debugs');
        component.addPower();
        expect(component.powersArray.length).toBe(1);
      });

      it('should remove a power correctly', () => {
        component.powerControl.setValue('Debugs');
        component.addPower();
        component.powerControl.setValue('Encrypts data');
        component.addPower();

        expect(component.powersArray.length).toBe(2);

        component.removePower(0);
        expect(component.powersArray.length).toBe(1);
        expect(component.powersArray.at(0).value).toBe('Encrypts data');
      });
    });

    describe('Form Submission', () => {
      it('should not emit heroSubmit event if the form is invalid', () => {
        spyOn(component.heroSubmit, 'emit');

        component.onSubmit();

        expect(component.heroSubmit.emit).not.toHaveBeenCalled();
      });

      it('should emit heroSubmit event with the correct data when form is valid', () => {
        spyOn(component.heroSubmit, 'emit');
        component.heroForm.get('name')?.setValue('PHANTOM PROXY');
        component.heroForm.get('realName')?.setValue('Liam Carter');
        component.powerControl.setValue('Redirects attacks to virtual decoys');
        component.addPower();
        component.heroForm.get('effectiveness')?.setValue(93);
        expect(component.heroForm.valid).toBe(true);

        component.onSubmit();

        expect(component.heroSubmit.emit).toHaveBeenCalled();
        expect(component.heroSubmit.emit).toHaveBeenCalledWith({
          name: 'PHANTOM PROXY',
          realName: 'Liam Carter',
          imageUrl: undefined,
          powers: ['Redirects attacks to virtual decoys'],
          weaknesses: [],
          effectiveness: 93,
          isAlive: true,
        });
      });
    });

    describe('Form Actions', () => {
      it('should emit formCancel event when onCancel is called', () => {
        spyOn(component.formCancel, 'emit');
        component.onCancel();
        expect(component.formCancel.emit).toHaveBeenCalled();
      });
    });
  });

  describe('Edit Mode', () => {
    const mockHero: Hero = {
      id: '1',
      name: 'CAPTAIN FIREWALL',
      realName: 'Alice Johnson',
      powers: ['Blocks malicious attacks'],
      effectiveness: 92,
      weaknesses: [],
      isAlive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should populate the form with hero data when inputs are set', () => {
      fixture.componentRef.setInput('hero', mockHero);
      fixture.componentRef.setInput('mode', 'edit');
      fixture.detectChanges();

      expect(component.heroForm.get('name')?.value).toBe(mockHero.name);
      expect(component.powersArray.length).toBe(1);
      expect(component.powersArray.at(0).value).toBe(
        'Blocks malicious attacks'
      );
    });

    it('should emit the updated hero data with ID on submit', () => {
      spyOn(component.heroSubmit, 'emit');

      fixture.componentRef.setInput('hero', mockHero);
      fixture.componentRef.setInput('mode', 'edit');
      fixture.detectChanges();

      component.heroForm.get('name')?.setValue('UPDATED NAME');
      component.onSubmit();

      expect(component.heroSubmit.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          id: '1',
          name: 'UPDATED NAME',
        })
      );
    });
  });

  describe('Weaknesses functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should add a weakness correctly', () => {
      component.weaknessControl.setValue('Bugs');
      component.addWeakness();

      expect(component.weaknessesArray.length).toBe(1);
      expect(component.weaknessesArray.at(0).value).toBe('Bugs');
    });

    it('should remove a weakness correctly', () => {
      component.weaknessControl.setValue('Bugs');
      component.addWeakness();
      component.weaknessControl.setValue('Overload');
      component.addWeakness();

      expect(component.weaknessesArray.length).toBe(2);

      component.removeWeakness(0);
      expect(component.weaknessesArray.length).toBe(1);
      expect(component.weaknessesArray.at(0).value).toBe('Overload');
    });

    it('should not add empty weakness', () => {
      component.weaknessControl.setValue('');
      component.addWeakness();

      expect(component.weaknessesArray.length).toBe(0);
    });
  });

  describe('Effectiveness slider', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have default effectiveness value of 50', () => {
      expect(component.effectivenessValue()).toBe(50);
    });

    it('should update effectiveness value when changed', () => {
      component.heroForm.get('effectiveness')?.setValue(75);

      expect(component.effectivenessValue()).toBe(75);
    });
  });

  describe('Form validation errors', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return error message for required fields', () => {
      const nameControl = component.heroForm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      const error = component.getFieldError('name');
      expect(error).toBe('name is required');
    });

    it('should return null when field has no errors', () => {
      const nameControl = component.heroForm.get('name');
      nameControl?.setValue('Valid Hero Name');

      const error = component.getFieldError('name');
      expect(error).toBeNull();
    });

    it('should return error for effectiveness out of range', () => {
      const effectivenessControl = component.heroForm.get('effectiveness');
      effectivenessControl?.setValue(101);
      effectivenessControl?.markAsTouched();

      const error = component.getFieldError('effectiveness');
      expect(error).toBe('Value too high');
    });
  });

  describe('Reset form functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should reset form to default values in create mode', () => {
      component.heroForm.get('name')?.setValue('Test Hero');
      component.heroForm.get('effectiveness')?.setValue(80);
      component.powerControl.setValue('Test Power');
      component.addPower();

      component.resetForm();

      expect(component.heroForm.get('name')?.value).toBe('');
      expect(component.heroForm.get('effectiveness')?.value).toBe(50);
      expect(component.powersArray.length).toBe(0);
    });

    it('should clear power and weakness controls after reset', () => {
      component.powerControl.setValue('Some Power');
      component.weaknessControl.setValue('Some Weakness');

      component.resetForm();

      expect(component.powerControl.value).toBeNull();
      expect(component.weaknessControl.value).toBeNull();
    });
  });

  describe('Input validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate imageUrl field', () => {
      const imageUrlControl = component.heroForm.get('imageUrl');
      imageUrlControl?.setValue('invalid-url');
      imageUrlControl?.markAsTouched();

      expect(imageUrlControl?.valid).toBe(false);
    });

    it('should accept empty imageUrl as valid', () => {
      const imageUrlControl = component.heroForm.get('imageUrl');
      imageUrlControl?.setValue('');

      expect(imageUrlControl?.valid).toBe(true);
    });
  });
});
