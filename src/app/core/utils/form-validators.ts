import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static url(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  }

  static lettersOnly(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const lettersOnlyPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/;
    if (!lettersOnlyPattern.test(control.value)) {
      return { lettersOnly: true };
    }
    return null;
  }
}
