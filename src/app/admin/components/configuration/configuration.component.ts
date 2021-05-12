import {
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
  LoadConfiguration,
  PublishConfiguration,
  SaveConfiguration
} from '../../../store/admin.action';
import { CountrystatesService } from '../../../shared/countrystates.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  configurationForm: FormGroup;
  subject = new Subject();
  isSaved = false;
  logoImage: string;
  galleryImages = [];
  countryStates: string;
  public Editor = ClassicEditor;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private store: Store,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    public countryStatesService: CountrystatesService
  ) {}

  @Select((state) => state.adminState.loading)
  loading$: Observable<boolean>;

  @Select((state) => state.adminState.configurationDraft)
  configurationDraft$: Observable<IConfiguration>;

  @Select((state) => state.adminState.configurationDraft.description)
  description$: Observable<string>;

  @Select((state) => state.adminState.configurationPublished)
  configurationPublished$: Observable<IConfiguration>;

  ngOnInit(): void {
    this.store.dispatch(new LoadConfiguration());
    this.formWithState(this.configurationDraft$);

    this.actions$
      .pipe(ofActionSuccessful(SaveConfiguration), takeUntil(this.subject))
      .subscribe(() => {
        this.isSaved = true;
        this.snackBar.open('Successfully saved', 'OK', {
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

    this.actions$
      .pipe(ofActionSuccessful(PublishConfiguration), takeUntil(this.subject))
      .subscribe(() => {
        this.snackBar.open('Successfully published', 'OK', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar--success']
        });
      });

    this.actions$
      .pipe(ofActionErrored(PublishConfiguration), takeUntil(this.subject))
      .subscribe(() => {
        this.snackBar.open('Error', 'OK', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar--error']
        });
      });
  }

  formWithState(website: Observable<IConfiguration>): void {
    website
      .pipe(takeUntil(this.subject))
      .subscribe((configuration: IConfiguration | null) => {
        const conf = configuration || ({} as IConfiguration);

        this.countryStates = conf.country;
        this.logoImage = conf.logo;

        this.configurationForm = new FormGroup({
          name: new FormControl(conf.name, [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.-]*$')
          ]),
          title: new FormControl(conf.title, [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9_.-]*$')
          ]),
          description: new FormControl(conf.description),
          firstName: new FormControl(conf.firstName, [Validators.required]),
          lastName: new FormControl(conf.lastName, [Validators.required]),
          email: new FormControl(conf.email, [
            Validators.required,
            Validators.email
          ]),
          phoneNumber: new FormControl(conf.phoneNumber, [Validators.required]),
          country: new FormControl(conf.country, [Validators.required]),
          address: new FormControl(conf.address, [Validators.required]),
          city: new FormControl(conf.city, [Validators.required]),
          state: new FormControl(conf.state),
          postalCode: new FormControl(conf.postalCode, [Validators.required])
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

  uploadFileEvt(imgFile: any, type): void {
    const reader = new FileReader();

    if (type === 'logo') {
      reader.onload = (e: any) => {
        this.logoImage = e.target.result;
      };
    }

    if (type === 'gallery') {
      reader.onload = (e: any) => {
        this.galleryImages.push(e.target.result);
        console.log(this.galleryImages);
      };
    }

    reader.readAsDataURL(imgFile.target.files[0]);
  }

  test(q): void {
    this.galleryImages[0] = q;
  }

  onSave(formGroup: FormGroup): void {
    formGroup.value.logo = this.logoImage;
    formGroup.value.gallery = this.galleryImages[0];

    this.store.dispatch(new SaveConfiguration(formGroup.value));
  }

  onPublish(formGroup: FormGroup): void {
    formGroup.value.logo = this.logoImage;

    this.store.dispatch(new PublishConfiguration(formGroup.value));
  }

  onReset(): void {
    this.formWithState(this.configurationPublished$);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
