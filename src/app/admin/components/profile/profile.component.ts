import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Actions, ofActionDispatched, Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserLoggedInSuccess } from 'src/app/store/admin.action';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy, DoCheck {
  profileForm: FormGroup;
  hide = true;
  subject = new Subject();
  user: Backendless.User;
  userEmail: string;

  @Select((state) => state.adminState.loading)
  loading$: Observable<boolean>;

  @Select((state) => state.adminState.currentUser)
  currentUser$: Observable<Backendless.User>;

  constructor(private actions$: Actions) {}

  ngOnInit(): void {
    this.actions$
      .pipe(ofActionDispatched(UserLoggedInSuccess), takeUntil(this.subject))
      .subscribe((value) => {
        this.user = value.user;
        this.userEmail = value.user.email;
      });
  }

  ngDoCheck(): void {
    this.profileForm = new FormGroup({
      email: new FormControl(this.userEmail, [
        Validators.required,
        Validators.email
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z ]*')
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z ]*')
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z ]*')
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z ]*')
      ]),
      password: new FormControl('', [
        Validators.maxLength(30),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,20}')
      ]),
      confirmPassword: new FormControl('', [Validators.required])
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

  get phone(): AbstractControl {
    return this.profileForm.get('phone');
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

  onSave(form): void {
    console.log(form);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
