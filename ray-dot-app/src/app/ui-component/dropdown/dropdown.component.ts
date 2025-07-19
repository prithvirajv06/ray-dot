import { Component, forwardRef, Input, signal } from '@angular/core';
import { BaseController } from '../base-controller';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'fox-dropdown',
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent extends BaseController {
  @Input({ required: true }) items: FoxDropDownItems[] = [];
  filterKey: string = '';
  showDropdown = signal(false);
  filterContent() {}

  setOption(option: FoxDropDownItems) {
    this.onInput({ target: { value: option } });
    this.showDropdown.update(() => false);
  }
}

export interface FoxDropDownItems {
  code: string;
  desc: string;
}
