import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  SendMessage,
  SendMessageError,
  SendMessageSuccess
} from '../../../store/landing.action';
import { takeUntil } from 'rxjs/operators';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {
  contactsForm: FormGroup;
  subject = new Subject();

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
            title: 'Success',
            description: 'Your message was sent',
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
            title: 'Error',
            description: 'There was an error sending your data',
            style: 'warn',
            icon: 'error_outline'
          }
        });
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
    private actions$: Actions
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
