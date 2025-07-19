import { Component, forwardRef } from '@angular/core';
import { BaseController } from '../base-controller';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'fox-textarea',
  imports: [],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
    providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    }
  ],
})
export class TextareaComponent extends BaseController{

}
