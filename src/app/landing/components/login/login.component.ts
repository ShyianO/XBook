import { Component, DoCheck, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import {
  LoginUser,
  LoginUserSuccess,
  LogoutUser,
  RegisterUserSuccess
} from '../../../store/landing.action';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { AlertComponent } from '../alert/alert.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, DoCheck {
  loginForm: FormGroup;
  hide = true;
  subject = new Subject();
  userExists: boolean;
  successTitle: string;
  successDescription: string;

  @Select((state) => state.landingState.loading)
  loading$: Observable<boolean>;

  @Select((state) => state.landingState.isLoggedIn)
  isLoggedIn$: Observable<boolean>;

  @Select((state) => state.landingState.username)
  username$: Observable<boolean>;

  @Select((state) => state.landingState.isUserDataIncorrect)
  isUserDataIncorrect$: Observable<boolean>;

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

    this.actions$
      .pipe(ofActionDispatched(LoginUserSuccess), takeUntil(this.subject))
      .subscribe(() => {
        this.dialog.open(AlertComponent, {
          data: {
            title: this.successTitle,
            description: this.successDescription,
            style: 'primary',
            icon: 'check_circle',
            redirectTo: '/landing'
          }
        });
      });
  }

  ngDoCheck(): void {
    this.translate
      .get('ALERT.LOGIN.SUCCESS')
      .pipe(takeUntil(this.subject))
      .subscribe((translated) => {
        this.successTitle = translated.TITLE;
        this.successDescription = translated.DESCRIPTION;
      });
  }

  get username(): AbstractControl {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  constructor(
    private store: Store,
    private actions$: Actions,
    public dialog: MatDialog,
    public translate: TranslateService
  ) {}

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

  onLogout(): void {
    this.store.dispatch(new LogoutUser());
  }
}
