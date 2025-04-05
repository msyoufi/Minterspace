import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'ms-volume-panel',
  imports: [CommonModule],
  template: `
    <p class="title">24h Total Volume</p>
    <p class="value">
      <span>$</span>{{volume() | number : '1.0-0'}}
    </p>
`,
  styleUrl: './category-panels.component.scss'
})
export class VolumePanelComponent {
  volume = input.required<number>();
}
