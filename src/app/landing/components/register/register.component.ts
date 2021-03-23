import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@ngxs/store';

import { IRegisterRequest } from '../../../core/interfaces/register.interface';
import { RegisterUser } from '../../../store/landing.action';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  loading = false;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
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
  }

  get name(): AbstractControl {
    return this.loginForm.get('name');
  }

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  constructor(private store: Store) {}

  onSubmit({
    value,
    valid
  }: {
    value: IRegisterRequest;
    valid: boolean;
  }): void {
    if (!valid) {
      return;
    }

    this.store.dispatch(new RegisterUser(value));
  }
}
