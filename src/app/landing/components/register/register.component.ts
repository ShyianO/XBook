import {
  AfterViewInit,
  Component,
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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hide = true;
  subject = new Subject();
  userExists: boolean;

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
            title: 'Registration success',
            description: `
                Thank you for registration<br>
                You will be redirected to login page
              `,
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
            title: 'Registration failed',
            description: `
                We are sorry, but something went wrong <br>
                Please try again
              `,
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
    private actions$: Actions
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
