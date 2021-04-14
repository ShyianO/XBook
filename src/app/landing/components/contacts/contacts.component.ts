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

import { AlertComponent } from '../alert/alert.component';
import {
  SendMessage,
  SendMessageError,
  SendMessageSuccess
} from '../../../store/landing.action';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy, DoCheck {
  contactsForm: FormGroup;
  subject = new Subject();
  successTitle: string;
  successDescription: string;
  errorTitle: string;
  errorDescription: string;

  @Select((state) => state.landingState.loading)
  loading$: Observable<boolean>;

  ngOnInit(): void {
    this.contactsForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(30)
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [
        Validators.required,
        Validators.maxLength(250)
      ])
    });

    this.actions$
      .pipe(ofActionDispatched(SendMessageSuccess), takeUntil(this.subject))
      .subscribe(() => {
        this.dialog.open(AlertComponent, {
          data: {
            title: this.successTitle,
            description: this.successDescription,
            style: 'primary',
            icon: 'check_circle'
          }
        });
      });

    this.actions$
      .pipe(ofActionDispatched(SendMessageError), takeUntil(this.subject))
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
  }

  ngDoCheck(): void {
    this.translate
      .get('ALERT.CONTACTS.SUCCESS')
      .pipe(takeUntil(this.subject))
      .subscribe((translated) => {
        this.successTitle = translated.TITLE;
        this.successDescription = translated.DESCRIPTION;
      });

    this.translate
      .get('ALERT.CONTACTS.ERROR')
      .pipe(takeUntil(this.subject))
      .subscribe((translated) => {
        this.errorTitle = translated.TITLE;
        this.errorDescription = translated.DESCRIPTION;
      });
  }

  get name(): AbstractControl {
    return this.contactsForm.get('name');
  }

  get email(): AbstractControl {
    return this.contactsForm.get('email');
  }

  get message(): AbstractControl {
    return this.contactsForm.get('message');
  }

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private actions$: Actions,
    public translate: TranslateService
  ) {}

  onSubmit({ value }: { value: Record<string, string> }): void {
    const messageRequest = {
      name: value.name,
      email: value.email,
      message: value.message
    };

    this.store.dispatch(new SendMessage(messageRequest));
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
