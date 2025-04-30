import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbsolutPipe } from '../../../../shared/pipes/absolut.pipe';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'ms-asset-panes',
  imports: [RouterLink, CommonModule, AbsolutPipe, MatTooltip],
  templateUrl: './asset-panes.component.html',
  styleUrl: './asset-panes.component.scss'
})
export class AssetPanesComponent {
  asset = input.required<Asset>();
}
