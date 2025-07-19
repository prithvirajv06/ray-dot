import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'fox-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input({ required: true }) label: string = 'Need Name';
  @Input({ required: true }) id: string = this.label;
  @Input() disabled: boolean = false;
  @Input() icon!: string;
}
