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
        title: '',
        phoneNumber: '',
        address: '',
        description: ''
      };

      if (configuration) {
        website = {
          title: configuration.title,
          phoneNumber: configuration.phoneNumber,
          address: configuration.address,
          description: configuration.description
        };
      }

      const { title, phoneNumber, address, description } = website;

      this.configurationForm = new FormGroup({
        title: new FormControl(title, [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.-]*$')
        ]),
        phoneNumber: new FormControl(phoneNumber, [Validators.required]),
        address: new FormControl(address, [Validators.required]),
        description: new FormControl(description)
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

  get title(): AbstractControl {
    return this.configurationForm.get('title');
  }

  get description(): AbstractControl {
    return this.configurationForm.get('description');
  }

  get phoneNumber(): AbstractControl {
    return this.configurationForm.get('phoneNumber');
  }

  get address(): AbstractControl {
    return this.configurationForm.get('address');
  }

  onSave(configuration: FormGroup): void {
    this.store.dispatch(new SaveConfiguration(configuration.value));
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
