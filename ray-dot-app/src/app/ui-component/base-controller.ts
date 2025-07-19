import {
  Input,
  Output,
  EventEmitter,
  Component,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'base-custom-input',
  template: '',
  styles: [],
})
export class BaseController implements ControlValueAccessor {
  @Input({ required: true }) id: string = '' + Math.random();
  @Input({ required: true }) label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() showErrors: boolean = true;
  @Input() customValidators: ((value: any) => ValidationErrors | null)[] = [];

  value: any = '';
  @Input() disabled: boolean = false;
  isFocused: boolean = false;
  errors: ValidationErrors | null = null;

  @Input() errorMessage: string = '';
  @Input() hasError: boolean = false;

  inputId: string = `custom-input-${Math.random().toString(36).substr(2, 9)}`;

  // ControlValueAccessor callback functions
  private onChange = (value: string) => {};
  private onTouched = () => {};

  // ControlValueAccessor interface implementation
  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onInput(event: any): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  onFocus(): void {
    // Optional: Handle focus events
  }
}

export interface InputEventData {
  value: any;
  field?: string;
  timestamp: Date;
}

export interface ValidationEventData {
  isValid: boolean;
  errors?: ValidationErrors | null;
  value: any;
}
