import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly loadingCounter = signal(0);

  readonly isLoading = computed(() => this.loadingCounter() > 0);

  show(): void {
    this.loadingCounter.update((count) => count + 1);
  }

  hide(): void {
    this.loadingCounter.update((count) => Math.max(0, count - 1));
  }
}
