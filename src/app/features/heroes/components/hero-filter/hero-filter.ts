import {
  Component,
  output,
  input,
  OnInit,
  inject,
  DestroyRef,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-hero-filter',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
  ],
  templateUrl: './hero-filter.html',
  styleUrl: './hero-filter.css',
  encapsulation: ViewEncapsulation.None
})
export class HeroFilter implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly initialSearchTerm = input<string>('');
  readonly searchTermChange = output<string>();

  readonly searchControl = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    this.initializeSearch();
    this.setupSearchSubscription();
  }

  private initializeSearch(): void {
    const initialTerm = this.initialSearchTerm();
    if (initialTerm) {
      this.searchControl.setValue(initialTerm, { emitEvent: false });
    }
  }

  private setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((searchTerm) => this.emitSearchTerm(searchTerm));
  }

  private emitSearchTerm(searchTerm: string): void {
    this.searchTermChange.emit(searchTerm?.trim() || '');
  }

  clearFilter(): void {
    this.searchControl.setValue('');
  }
}
