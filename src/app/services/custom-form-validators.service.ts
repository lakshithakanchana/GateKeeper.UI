import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomFormValidatorsService {

  constructor() { }

  getErrorMessage(control: AbstractControl | null): string {
    if(control === null)
      return '';
    if(control.hasError('required'))
      return 'This field is required!';
    if(control.hasError('min'))
      return "Minimum value is 1!";
    if(control.hasError('noWhiteSpacesAllowed'))
      return 'White spaces are not allowed!';
    if(control.hasError('notZeroOrBelow'))
    return 'Invalid selection!';
    if(control.hasError('fromToLocationsConflict'))
      return "Form Location can't be same as To Location!";
    if(control.hasError('minlength'))
      return "Must be longer than 5 characters!";
    return '';
  }

  noWhiteSpacesAllowed(control: AbstractControl): ValidationErrors | null {
    if(control.value.length !== control.value.replace(/\s+/g, '').length) {
      return {noWhiteSpacesAllowed: true}
    }
    return null;
  }

  notZeroOrBelow(control: AbstractControl): ValidationErrors | null {
    if(control.value <= 0) {
      return {notZeroOrBelow: true}
    }
    return null;
  }

}
