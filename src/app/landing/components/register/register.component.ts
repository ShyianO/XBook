import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Select, Store } from '@ngxs/store';

import { IRegisterRequest } from '../../../core/interfaces/register.interface';
import { RegisterUser } from '../../../store/landing.action';
import { LandingState } from '../../../store/landing.state';
import { Observable } from 'rxjs';
import { IUser } from '../../../core/interfaces/user.interface';
import { ILandingState } from '../../../core/interfaces/landing.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;

  @Select(LandingState) loading$: Observable<ILandingState>;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z ]*')
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,20}')
      ]),
      confirmPassword: new FormControl('', [Validators.required])
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

  get confirmPassword(): AbstractControl {
    return this.loginForm.get('confirmPassword');
  }

  constructor(private store: Store) {}

  onSubmit({
    value,
    valid
  }: {
    value: IRegisterRequest;
    valid: boolean;
  }): void {
    if (valid) {
      const user = new IUser();

      user.email = value.email;
      user.name = value.name;
      user.password = value.password;

      this.store.dispatch(new RegisterUser(user));
    }
  }
}
