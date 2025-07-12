import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { JsonNodeComponentComponent } from '../../ui-component/json-node-component/json-node-component.component';

@Component({
  selector: 'app-data-model',
  imports: [NgFor, NgIf, KeyValuePipe, JsonNodeComponentComponent],
  templateUrl: './data-model.component.html',
  styleUrl: './data-model.component.scss',
})
export class DataModelComponent {
  @Input() jsonData: any = {
    name: 'String',
    age: 'Number',
    skills: ['String'],
    address: {
      street: 'String',
      city: 'String',
      zip: ['String', 'Number'],
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
            zip: ['String', 'Number'],
          },
        },
      ],
      mon: [],
    },
  };
  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getValue(value: any): any {
    return value;
  }
}
