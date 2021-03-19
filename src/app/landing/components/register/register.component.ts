import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IRegister } from './register.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  hide = true;

  loginForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern('[a-zA-Z ]*')
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,20}')
    ])
  });

  onSubmit({ value, valid }: { value: IRegister; valid: boolean }): void {
    if (valid) {
      alert(`Welcome, ${value.name}`);
    }
  }
}
