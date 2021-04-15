import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IUser } from '../../../core/interfaces/user.interface';
import {
  UpdateUser,
  UpdateUserError,
  UpdateUserSuccess
} from '../../../store/admin.action';
import { AlertComponent } from '../../../landing/components/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  hide = true;
  subject = new Subject();

  @Select((state) => state.adminState.loading)
  loading$: Observable<boolean>;

  @Select((state) => state.adminState.currentUser)
  currentUser$: Observable<Backendless.User>;

  constructor(
    private store: Store,
    private actions$: Actions,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser$.subscribe((user: IUser) => {
      if (user) {
        const { email, firstName, lastName, phoneNumber, address } = user;

        this.profileForm = new FormGroup(
          {
            email: new FormControl(email, [
              Validators.required,
              Validators.email
            ]),
            firstName: new FormControl(firstName, [
              Validators.required,
              Validators.pattern('[a-zA-Z ]*')
            ]),
            lastName: new FormControl(lastName, [
              Validators.required,
              Validators.pattern('[a-zA-Z ]*')
            ]),
            phoneNumber: new FormControl(phoneNumber, [
              Validators.required,
              Validators.minLength(10),
              Validators.maxLength(12)
            ]),
            address: new FormControl(address, [
              Validators.required,
              Validators.pattern('[a-zA-Z ]*')
            ]),
            password: new FormControl('', [
              Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,20}')
            ]),
            confirmPassword: new FormControl('')
          },
          { validators: this.passwordMatchValidator }
        );
      }
    });

    this.actions$
      .pipe(ofActionDispatched(UpdateUserSuccess), takeUntil(this.subject))
      .subscribe(() => {
        this.dialog.open(AlertComponent, {
          data: {
            title: 'Update successful',
            description: 'Thank you for updating your data',
            style: 'primary',
            icon: 'check_circle',
            redirectTo: '/admin/dashboard'
          }
        });
      });

    this.actions$
      .pipe(ofActionDispatched(UpdateUserError), takeUntil(this.subject))
      .subscribe(() => {
        this.dialog.open(AlertComponent, {
          data: {
            title: 'Update failed',
            description: 'Something went wrong',
            style: 'warn',
            icon: 'error_outline'
          }
        });
      });
  }

  get email(): AbstractControl {
    return this.profileForm.get('email');
  }

  get firstName(): AbstractControl {
    return this.profileForm.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.profileForm.get('lastName');
  }

  get phoneNumber(): AbstractControl {
    return this.profileForm.get('phoneNumber');
  }

  get address(): AbstractControl {
    return this.profileForm.get('address');
  }

  get password(): AbstractControl {
    return this.profileForm.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.profileForm.get('confirmPassword');
  }

  passwordMatchValidator(frm: FormGroup): { [s: string]: boolean } {
    return frm.controls.password.value === frm.controls.confirmPassword.value
      ? null
      : { mismatch: true };
  }

  onSave({ value }: { value: Record<string, string> }): void {
    const updateUserRequest = {
      email: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
      phoneNumber: value.phoneNumber,
      address: value.address,
      password: value.password,
      objectId: ''
    };

    this.store.dispatch(new UpdateUser(updateUserRequest));
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
