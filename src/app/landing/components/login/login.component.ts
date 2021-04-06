import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Actions, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoginUser, RegisterUser } from '../../../store/landing.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;

  @Select((state) => state.landingState.loading)
  loading$: Observable<boolean>;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.maxLength(30)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(30)
      ])
    });
  }

  get username(): AbstractControl {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  constructor(private store: Store) {}

  onSubmit({
    value,
    valid
  }: {
    value: Record<string, string>;
    valid: boolean;
  }): void {
    if (valid) {
      const loginRequest = {
        username: value.username,
        password: value.password
      };

      this.store.dispatch(new LoginUser(loginRequest));
    }
  }
}
