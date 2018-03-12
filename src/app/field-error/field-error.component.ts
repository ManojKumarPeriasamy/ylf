import { Component, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'field-error',
  templateUrl: './field-error.component.html',
  styleUrls: ['./field-error.component.css']
})
export class FieldErrorComponent {

  private static readonly errorMessages = {
    'required': () => 'Required Field !!!',
    'minlength': (params) => 'Minimum ' + params.requiredLength + ' characters should be typed',
    'maxlength': (params) => 'Maximum characters allowed is ' + params.requiredLength,
    'pattern': (params) => params.message,
    'date': (params) => params.message
  };

  @Input()
  private control: AbstractControlDirective | AbstractControl;
  @Input() private customerror: string;

  shouldShowErrors(): boolean {
    return this.control &&
      this.control.errors &&
      this.control.touched;
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors)
      .map(field => this.getMessage(field, this.control.errors[field]));
  }

  private getMessage(type: string, params: any) {
    if(type == 'pattern') {
      params.message = this.customerror;
    }
    return FieldErrorComponent.errorMessages[type](params);
  }

}
