import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'fox-dialog',
  imports: [NgClass],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  @Input() title: string = 'Alert !';
  @Input() dialogSize: 'large' | 'small' | 'medium' = 'medium';
  @Output() close: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  closePopup() {
    this.close.emit(true);
  }
}
