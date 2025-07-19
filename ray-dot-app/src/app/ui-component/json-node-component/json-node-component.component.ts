import { KeyValuePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DropdownComponent,
  FoxDropDownItems,
} from '../dropdown/dropdown.component';

@Component({
  selector: 'fox-json-node-component',
  imports: [
    NgFor,
    NgIf,
    KeyValuePipe,
    NgStyle,
    FormsModule,
    ReactiveFormsModule,
    DialogComponent,
    InputComponent,
    ButtonComponent,
    DropdownComponent,
  ],
  templateUrl: './json-node-component.component.html',
  styleUrl: './json-node-component.component.scss',
})
export class JsonNodeComponentComponent {
  @Input() key: any = '';
  @Input() value: any;
  @Input() depth: number = 0; // ← track nesting level
  fieldKey!: string;
  fieldType!: string;
  colorPalette: string[] = [
    '#1abc9c',
    '#3498db',
    '#9b59b6',
    '#e67e22',
    '#e74c3c',
    '#2ecc71',
    '#34495e',
  ];
  isExpanded: boolean = false;
  showFieldModal = signal(false);

  typeDropdown: FoxDropDownItems[] = [
    { code: 'BOOLEAN', desc: 'Boolean' },
    { code: 'NUMBER', desc: 'Number' },
    { code: 'STR', desc: 'string' },
    { code: 'OBJ', desc: 'Object' },
    { code: 'ARRAY', desc: 'Array' },
  ];

  @Output() valueChange = new EventEmitter<any>();
  // Field Modal form
  fieldModel = new FormGroup({
    key: new FormControl('', [Validators.required]),
    type: new FormControl({ code: '', desc: '' }, [Validators.required]),
  });

  getColor(): string {
    return this.colorPalette[this.depth % this.colorPalette.length];
  }

  isObject(val: any): boolean {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  toggleNode() {
    this.isExpanded = !this.isExpanded;
  }

  isExpandable(value: any): boolean {
    return this.isArray(value) || this.isObject(value);
  }

  isComplex(value: any): boolean {
    return this.isArray(value) || this.isObject(value);
  }

  isPrimitive(value: any): boolean {
    return !this.isComplex(value);
  }

  showAddButton(value: any): boolean {
    return (this.isArray(value) && value.length === 0) || this.isObject(value);
  }

  getValueType(value: any): string {
    if (Array.isArray(value)) return 'Array';
    if (value !== null && typeof value === 'object') return 'Object';
    return typeof value;
  }

  openAddFieldDialog(value: any) {
    this.showFieldModal.set(true);
  }

  saveField() {
    let key: any = this.fieldModel.value.key;
    let value: any = '';
    switch (this.fieldModel.value.type?.code) {
      case 'OBJ':
        value = {};
        break;
      case 'ARRAY':
        value = [];
        break;
      case 'BOOLEAN':
        value = false;
        break;
      case 'NUMBER':
        value = 0;
        break;
      default:
        break;
    }
    if (this.isArray(this.value)) {
      if (this.value) {
        this.value = [{}];
      }
      this.value[0][key] = value;
    } else {
      this.value[key] = value;
    }
    this.showFieldModal.update(() => false);
    this.valueChange.emit([this.key, this.value]);
  }

  valueChangeinData(event: any) {
    this.value[event[0]] = event[1];
  }

  closeDialog() {
    this.showFieldModal.update(() => false);
  }
}
