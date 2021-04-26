import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  Actions,
  ofActionErrored,
  ofActionSuccessful,
  Select,
  Store
} from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { IConfiguration } from '../../../core/interfaces/configuration.interface';
import { SaveConfiguration } from '../../../store/admin.action';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  configurationForm: FormGroup;
  subject = new Subject();
  public Editor = ClassicEditor;

  constructor(
    private store: Store,
    private actions$: Actions,
    private snackBar: MatSnackBar
  ) {}

  @Select((state) => state.adminState.loading)
  loading$: Observable<boolean>;

  @Select((state) => state.adminState.configuration)
  configuration$: Observable<IConfiguration>;

  ngOnInit(): void {
    this.configuration$.subscribe((configuration) => {
      let website = {
        name: '',
        title: '',
        description: '',
        phoneNumber: '',
        email: '',
        address: '',
        city: '',
        state: '',
        postalCode: ''
      };

      if (configuration) {
        website = {
          name: configuration.name,
          title: configuration.title,
          description: configuration.description,
          phoneNumber: configuration.phoneNumber,
          email: configuration.email,
          address: configuration.address,
          city: configuration.city,
          state: configuration.state,
          postalCode: configuration.postalCode
        };
      }

      const {
        name,
        title,
        description,
        phoneNumber,
        email,
        address,
        city,
        state,
        postalCode
      } = website;

      this.configurationForm = new FormGroup({
        name: new FormControl(name, [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.-]*$')
        ]),
        title: new FormControl(title, [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.-]*$')
        ]),
        description: new FormControl(description),
        phoneNumber: new FormControl(phoneNumber, [Validators.required]),
        email: new FormControl(email, [Validators.email]),
        address: new FormControl(address, [Validators.required]),
        city: new FormControl(city, [Validators.required]),
        state: new FormControl(state),
        postalCode: new FormControl(postalCode, [Validators.required])
      });
    });

    this.actions$
      .pipe(ofActionSuccessful(SaveConfiguration), takeUntil(this.subject))
      .subscribe(() => {
        this.snackBar.open('Success', 'OK', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar--success']
        });
      });

    this.actions$
      .pipe(ofActionErrored(SaveConfiguration), takeUntil(this.subject))
      .subscribe(() => {
        this.snackBar.open('Error', 'OK', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar--error']
        });
      });
  }

  get name(): AbstractControl {
    return this.configurationForm.get('name');
  }

  get title(): AbstractControl {
    return this.configurationForm.get('title');
  }

  get description(): AbstractControl {
    return this.configurationForm.get('description');
  }

  get phoneNumber(): AbstractControl {
    return this.configurationForm.get('phoneNumber');
  }

  get email(): AbstractControl {
    return this.configurationForm.get('email');
  }

  get address(): AbstractControl {
    return this.configurationForm.get('address');
  }

  get city(): AbstractControl {
    return this.configurationForm.get('city');
  }

  get state(): AbstractControl {
    return this.configurationForm.get('state');
  }

  get postalCode(): AbstractControl {
    return this.configurationForm.get('postalCode');
  }

  onSave(configuration: FormGroup): void {
    this.store.dispatch(new SaveConfiguration(configuration.value));
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
