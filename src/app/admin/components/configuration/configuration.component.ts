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
import {
  PublishConfiguration,
  SaveConfiguration
} from '../../../store/admin.action';

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

  @Select((state) => state.adminState.configurationDraft)
  configurationDraft$: Observable<IConfiguration>;

  ngOnInit(): void {
    this.formWithState();

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

  formWithState(): void {
    this.configurationDraft$.subscribe((configuration) => {
      let website = {
        name: '',
        title: '',
        description: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        country: '',
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
          firstName: configuration.firstName,
          lastName: configuration.lastName,
          email: configuration.email,
          phoneNumber: configuration.phoneNumber,
          country: configuration.country,
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
        firstName,
        lastName,
        email,
        phoneNumber,
        country,
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
        firstName: new FormControl(firstName, [Validators.required]),
        lastName: new FormControl(lastName, [Validators.required]),
        email: new FormControl(email, [Validators.required, Validators.email]),
        phoneNumber: new FormControl(phoneNumber, [Validators.required]),
        country: new FormControl(country, [Validators.required]),
        address: new FormControl(address, [Validators.required]),
        city: new FormControl(city, [Validators.required]),
        state: new FormControl(state),
        postalCode: new FormControl(postalCode, [Validators.required])
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

  get firstName(): AbstractControl {
    return this.configurationForm.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.configurationForm.get('lastName');
  }

  get email(): AbstractControl {
    return this.configurationForm.get('email');
  }

  get phoneNumber(): AbstractControl {
    return this.configurationForm.get('phoneNumber');
  }

  get country(): AbstractControl {
    return this.configurationForm.get('country');
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

  onSave(configuration: FormGroup, editor): void {
    // testing
    console.log(editor);
    configuration.value.description = editor.editorWatchdog._data.main;

    this.store.dispatch(new SaveConfiguration(configuration.value));
  }

  onPublish(configuration: FormGroup, editor): void {
    configuration.value.description = editor.editorWatchdog._data.main;

    this.store.dispatch(new SaveConfiguration(configuration.value));
    this.store.dispatch(new PublishConfiguration(configuration.value));
  }

  onReset(): void {
    this.formWithState();
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
