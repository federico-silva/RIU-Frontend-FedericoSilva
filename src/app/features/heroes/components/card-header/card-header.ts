import { Component, input, output } from '@angular/core';
import { PageConfig } from '../../../../core/models/common.models';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card-header',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './card-header.html',
  styleUrl: './card-header.css'
})
export class CardHeader {
  readonly config = input.required<PageConfig>();
  readonly addClick = output<void>();
}
