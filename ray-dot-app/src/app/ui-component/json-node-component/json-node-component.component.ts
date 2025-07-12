import { KeyValuePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-json-node-component',
  imports: [NgFor, NgIf, KeyValuePipe, NgStyle],
  templateUrl: './json-node-component.component.html',
  styleUrl: './json-node-component.component.scss',
})
export class JsonNodeComponentComponent {
  @Input() key: any = '';
  @Input() value: any;
  @Input() depth: number = 0; // ← track nesting level

  colorPalette: string[] = [
    '#1abc9c',
    '#3498db',
    '#9b59b6',
    '#e67e22',
    '#e74c3c',
    '#2ecc71',
    '#34495e',
  ];

  getColor(): string {
    return this.colorPalette[this.depth % this.colorPalette.length];
  }

  isObject(val: any): boolean {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }
}
