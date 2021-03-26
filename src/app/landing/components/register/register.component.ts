import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

import {
  RegisterUser,
  RegisterUserError,
  RegisterUserSuccess
} from '../../../store/landing.action';
import { ILandingState } from '../../../core/interfaces/landing.interface';
import { AlertComponent } from '../alert/alert.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hide = true;
  registerSuccessSubscription: Subscription;
  registerErrorSubscription: Subscription;

  @Select((state) => state.landingState.loading)
  loading$: Observable<ILandingState>;

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
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    });

    this.registerSuccessSubscription = this.actions$
      .pipe(ofActionDispatched(RegisterUserSuccess))
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

    this.registerErrorSubscription = this.actions$
      .pipe(ofActionDispatched(RegisterUserError))
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

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private actions$: Actions,
    private router: Router,
    private route: ActivatedRoute
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
        name: value.name,
        password: value.password
      };

      this.store.dispatch(new RegisterUser(userRequest));
    }
  }

  ngOnDestroy(): void {
    if (this.registerSuccessSubscription) {
      this.registerSuccessSubscription.unsubscribe();
      this.registerSuccessSubscription = null;
    }

    if (this.registerErrorSubscription) {
      this.registerErrorSubscription.unsubscribe();
      this.registerErrorSubscription = null;
    }
  }
}
