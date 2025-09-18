import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LoadingService } from './core/services/loading.service';
import { LoadingSpinner } from './shared/loading-spinner/loading-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinner],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  public readonly loadingService = inject(LoadingService);
}
