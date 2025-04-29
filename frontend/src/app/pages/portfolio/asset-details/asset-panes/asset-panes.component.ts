import { Component, input } from '@angular/core';

@Component({
  selector: 'ms-asset-panes',
  imports: [],
  templateUrl: './asset-panes.component.html',
  styleUrl: './asset-panes.component.scss'
})
export class AssetPanesComponent {
  asset = input.required<Asset>();
}
