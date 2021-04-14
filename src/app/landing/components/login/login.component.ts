import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { LoginUser, LoginUserSuccess } from '../../../store/admin.action';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, DoCheck, OnDestroy {
  loginForm: FormGroup;
  hide = true;
  subject = new Subject();
  userExists: boolean;
  successTitle: string;
  successDescription: string;

  @Select((state) => state.adminState.loading)
  loading$: Observable<boolean>;

  @Select((state) => state.adminState.isUserDataIncorrect)
  isUserDataIncorrect$: Observable<boolean>;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
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
            redirectTo: '/admin/profile'
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

  get email(): AbstractControl {
    return this.loginForm.get('email');
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
        email: value.email,
        password: value.password
      };

      this.store.dispatch(new LoginUser(loginRequest));
    }
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
