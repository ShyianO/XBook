import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

import {
  RegisterUser,
  RegisterUserError,
  RegisterUserSuccess,
  UserExists
} from '../../../store/landing.action';
import { AlertComponent } from '../alert/alert.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy, DoCheck {
  loginForm: FormGroup;
  hide = true;
  subject = new Subject();
  userExists: boolean;
  successTitle: string;
  successDescription: string;
  errorTitle: string;
  errorDescription: string;

  @ViewChild('usernameInput', { static: true }) usernameInput: ElementRef;

  @Select((state) => state.landingState.loading)
  loading$: Observable<boolean>;

  @Select((state) => state.landingState.userExists)
  userExists$: Observable<boolean>;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z ]*'),
        () => this.validateUsername()
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,20}')
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    });

    this.userExists$
      .pipe(takeUntil(this.subject))
      .subscribe((value: boolean) => {
        this.userExists = value;
        this.username.updateValueAndValidity();
      });

    this.actions$
      .pipe(ofActionDispatched(RegisterUserSuccess), takeUntil(this.subject))
      .subscribe(() => {
        this.dialog.open(AlertComponent, {
          data: {
            title: this.successTitle,
            description: this.successDescription,
            style: 'primary',
            icon: 'check_circle',
            redirectTo: '/landing/login'
          }
        });
      });

    this.actions$
      .pipe(ofActionDispatched(RegisterUserError), takeUntil(this.subject))
      .subscribe(() => {
        this.dialog.open(AlertComponent, {
          data: {
            title: this.errorTitle,
            description: this.errorDescription,
            style: 'warn',
            icon: 'error_outline'
          }
        });
      });

    fromEvent(this.usernameInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(500),
        takeUntil(this.subject)
      )
      .subscribe((username) => {
        this.store.dispatch(new UserExists(username));
      });
  }

  ngDoCheck(): void {
    this.translate
      .get('ALERT.SUCCESS')
      .pipe(takeUntil(this.subject))
      .subscribe((translated) => {
        this.successTitle = translated.TITLE;
        this.successDescription = translated.DESCRIPTION;
      });

    this.translate
      .get('ALERT.ERROR')
      .pipe(takeUntil(this.subject))
      .subscribe((translated) => {
        this.errorTitle = translated.TITLE;
        this.errorDescription = translated.DESCRIPTION;
      });
  }

  get username(): AbstractControl {
    return this.loginForm.get('username');
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

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private actions$: Actions,
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
      const userRequest = {
        email: value.email,
        username: value.username,
        password: value.password
      };

      this.store.dispatch(new RegisterUser(userRequest));
    }
  }

  validateUsername(): ValidationErrors {
    return this.userExists
      ? {
          validateUsername: {
            valid: false
          }
        }
      : null;
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
