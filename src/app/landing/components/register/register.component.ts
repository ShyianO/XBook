import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  hide = true;

  name = new FormControl('', [
    Validators.required,
    Validators.maxLength(30),
    Validators.pattern('[a-zA-Z ]*')
  ]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.maxLength(30),
    Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,20}')
  ]);

  getNameError(): string {
    if (this.name.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.name.hasError('pattern') || this.name.hasError('maxlength')) {
      return 'Not a valid name';
    }

    return '';
  }

  getEmailError(): string {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordError(): string {
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }

    if (
      this.password.hasError('pattern') ||
      this.password.hasError('maxlength')
    ) {
      return 'Not a valid password';
    }

    return '';
  }

  submitHandler(): void {
    alert(`Welcome!`);
  }
}
