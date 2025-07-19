import { JsonPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { JsonNodeComponentComponent } from '../../ui-component/json-node-component/json-node-component.component';
import { BadgeComponent } from '../../ui-component/badge/badge.component';
import { DialogComponent } from '../../ui-component/dialog/dialog.component';
import { ButtonComponent } from '../../ui-component/button/button.component';
import { InputComponent } from '../../ui-component/input/input.component';
import { TextareaComponent } from '../../ui-component/textarea/textarea.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'fox-data-model',
  imports: [
    NgFor,
    NgIf,
    KeyValuePipe,
    JsonNodeComponentComponent,
    BadgeComponent,
    DialogComponent,
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './data-model.component.html',
  styleUrl: './data-model.component.scss',
})
export class DataModelComponent {
  data = 'sdfsdfd';
  @Input() jsonData: any = {
    name: 'String',
    age: 'Number',
    address: {
      street: 'String',
      city: 'String',
    },
    address2: {
      street: 'String',
      city: 'String',
      zip: [
        {
          street: 'String',
          city: 'String',
          zip: {
            street: 'String',
            city: 'String',
          },
        },
      ],
      mon: [],
    },
  };
  showStructDialog = signal(false);

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getValue(value: any): any {
    return value;
  }

  closeDialog() {
    this.showStructDialog.update(() => false);
  }
}
