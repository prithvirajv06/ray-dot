import { Component, signal } from '@angular/core';
import { DialogComponent } from '../../ui-component/dialog/dialog.component';
import { InputComponent } from '../../ui-component/input/input.component';
import { KeyValuePipe } from '@angular/common';
import { ButtonComponent } from '../../ui-component/button/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'fox-reference-data',
  imports: [
    DialogComponent,
    InputComponent,
    KeyValuePipe,
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reference-data.component.html',
  styleUrl: './reference-data.component.scss',
})
export class ReferenceDataComponent {
  showReferenceDataDialog = signal(false);
  showAddFieldDialog = signal(false);
  fieldName: string = '';
  referenceData = [
    {
      Code: '',
      Value: '',
    },
  ];

  addField() {
    this.showReferenceDataDialog.update(() => true);
  }
  addColToAllRow(colName: any) {
    for (let index = 0; index < this.referenceData.length; index++) {
      let refRow: any = this.referenceData[index];
      refRow[colName] = '';
    }
    this.showAddFieldDialog.set(false);
  }

  addRow() {
    let metaData = Object.assign(this.referenceData[0]);
    for (let index = 0; index < Object.keys(metaData).length; index++) {
      metaData[Object.keys(metaData)[index]] = '';
    }
    this.referenceData.push(metaData);
  }
}
