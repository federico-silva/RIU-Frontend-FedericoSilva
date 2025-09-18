import {
  Component,
  input,
  output,
  OnInit,
  inject,
  DestroyRef,
  signal,
  effect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { UppercaseDirective } from '../../../../core/directives/uppercase.directive';
import { CustomValidators } from '../../../../core/utils/form-validators';
import {
  CreateHeroRequest,
  FormMode,
  Hero,
  UpdateHeroRequest,
} from '../../../../core/models/hero.models';

@Component({
  selector: 'app-hero-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDividerModule,
    UppercaseDirective,
  ],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.css',
})
export class HeroForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly hero = input<Hero | null>(null);
  readonly mode = input<FormMode>('create');
  readonly isSubmitting = input<boolean>(false);

  readonly heroSubmit = output<CreateHeroRequest | UpdateHeroRequest>();
  readonly formCancel = output<void>();

  public heroForm!: FormGroup;

  public powerControl = this.fb.control('');
  public weaknessControl = this.fb.control('');
  readonly effectivenessValue = signal(50);

  get powersArray(): FormArray {
    return this.heroForm.get('powers') as FormArray;
  }

  get weaknessesArray(): FormArray {
    return this.heroForm.get('weaknesses') as FormArray;
  }

  constructor() {
    effect(() => {
      const form = this.heroForm;
      if (form) {
        const effectiveness = form.get('effectiveness')?.value;
        if (effectiveness !== undefined) {
          this.effectivenessValue.set(effectiveness);
        }
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();

    const heroData = this.hero();
    if (heroData && this.mode() === 'edit') {
      this.loadHeroData(heroData);
    }
  }

  private initializeForm(): void {
    this.heroForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      realName: ['', [Validators.maxLength(50), CustomValidators.lettersOnly]],
      imageUrl: ['', [CustomValidators.url]],
      powers: this.fb.array([], [Validators.minLength(1)]),
      weaknesses: this.fb.array([]),
      effectiveness: [
        50,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      isAlive: [true, [Validators.required]],
    });
  }

  private setupFormSubscriptions(): void {
    this.heroForm
      .get('effectiveness')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.effectivenessValue.set(value || 50));
  }

  private loadHeroData(hero: Hero): void {
    this.powersArray.clear();
    this.weaknessesArray.clear();

    this.heroForm.patchValue({
      name: hero.name,
      realName: hero.realName || '',
      imageUrl: hero.imageUrl || '',
      effectiveness: hero.effectiveness,
      isAlive: hero.isAlive,
    });

    hero.powers.forEach((power) => {
      this.powersArray.push(this.fb.control(power));
    });

    hero.weaknesses.forEach((weakness) => {
      this.weaknessesArray.push(this.fb.control(weakness));
    });

    this.effectivenessValue.set(hero.effectiveness);
  }

  public addPower(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const powerValue = this.powerControl.value?.trim();
    if (!powerValue) return;

    const currentPowers = this.powersArray.value.map((p: string) =>
      p.toLowerCase()
    );
    if (currentPowers.includes(powerValue.toLowerCase())) {
      this.powerControl.setErrors({ duplicate: true });
      return;
    }

    this.powersArray.push(this.fb.control(powerValue));
    this.powerControl.reset();
  }

  removePower(index: number): void {
    this.powersArray.removeAt(index);
  }

  addWeakness(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const weaknessValue = this.weaknessControl.value?.trim();
    if (!weaknessValue) return;

    const currentWeaknesses = this.weaknessesArray.value.map((w: string) =>
      w.toLowerCase()
    );
    if (currentWeaknesses.includes(weaknessValue.toLowerCase())) {
      this.weaknessControl.setErrors({ duplicate: true });
      return;
    }

    this.weaknessesArray.push(this.fb.control(weaknessValue));
    this.weaknessControl.reset();
  }

  removeWeakness(index: number): void {
    this.weaknessesArray.removeAt(index);
  }

  getFieldError(fieldName: string): string | null {
    const field = this.heroForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return null;

    if (field.errors['required']) return `${fieldName} is required`;
    if (field.errors['minlength']) return `${fieldName} is too short`;
    if (field.errors['maxlength']) return `${fieldName} is too long`;
    if (field.errors['min']) return `Value too low`;
    if (field.errors['max']) return `Value too high`;
    if (field.errors['invalidUrl']) return `Please enter a valid URL`;
    if (field.errors['duplicate']) return `This ${fieldName} already exists`;
    if (field.errors['lettersOnly'])
      return `Only letters and spaces are allowed`;

    if (fieldName === 'powers' && field.errors['minlength']) {
      return 'A hero must have at least one power';
    }

    return 'Invalid value';
  }

  resetForm(): void {
    if (this.mode() === 'edit' && this.hero()) {
      this.loadHeroData(this.hero()!);
    } else {
      this.heroForm.reset({
        name: '',
        realName: '',
        imageUrl: '',
        effectiveness: 50,
        isAlive: true,
      });
      this.powersArray.clear();
      this.weaknessesArray.clear();
      this.effectivenessValue.set(50);
    }

    this.powerControl.reset();
    this.weaknessControl.reset();
  }

  onSubmit(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }

    const formValue = this.heroForm.value;
    const heroData = {
      name: formValue.name.trim(),
      realName: formValue.realName?.trim() || undefined,
      imageUrl: formValue.imageUrl?.trim() || undefined,
      powers: formValue.powers || [],
      weaknesses: formValue.weaknesses || [],
      effectiveness: formValue.effectiveness,
      isAlive: formValue.isAlive,
    };

    if (this.mode() === 'edit' && this.hero()) {
      const updateData: UpdateHeroRequest = {
        id: this.hero()!.id,
        ...heroData,
      };
      this.heroSubmit.emit(updateData);
    } else {
      this.heroSubmit.emit(heroData as CreateHeroRequest);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
