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
  isSaved = false;
  dataimage: any;
  public Editor = ClassicEditor;

  countries: string[] = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antigua &amp; Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'Bosnia &amp; Herzegovina',
    'Botswana',
    'Brazil',
    'British Virgin Islands',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Cape Verde',
    'Cayman Islands',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Congo',
    'Cook Islands',
    'Costa Rica',
    'Cote D Ivoire',
    'Croatia',
    'Cruise Ship',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Estonia',
    'Ethiopia',
    'Falkland Islands',
    'Faroe Islands',
    'Fiji',
    'Finland',
    'France',
    'French Polynesia',
    'French West Indies',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Greece',
    'Greenland',
    'Grenada',
    'Guam',
    'Guatemala',
    'Guernsey',
    'Guinea',
    'Guinea Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hong Kong',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Isle of Man',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jersey',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kuwait',
    'Kyrgyz Republic',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macau',
    'Macedonia',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Namibia',
    'Nepal',
    'Netherlands',
    'Netherlands Antilles',
    'New Caledonia',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Norway',
    'Oman',
    'Pakistan',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Puerto Rico',
    'Qatar',
    'Reunion',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Pierre &amp; Miquelon',
    'Samoa',
    'San Marino',
    'Satellite',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'South Africa',
    'South Korea',
    'Spain',
    'Sri Lanka',
    'St Kitts &amp; Nevis',
    'St Lucia',
    'St Vincent',
    'St. Lucia',
    'Sudan',
    'Suriname',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    `Timor L'Este`,
    'Togo',
    'Tonga',
    'Trinidad &amp; Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Turks &amp; Caicos',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'Uruguay',
    'Uzbekistan',
    'Venezuela',
    'Vietnam',
    'Virgin Islands (US)',
    'Yemen',
    'Zambia',
    'Zimbabwe'
  ];
  states: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
  ];

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private store: Store,
    private actions$: Actions,
    private snackBar: MatSnackBar
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
          postalCode: new FormControl(conf.postalCode, [Validators.required]),
          ckeditor: new FormControl('123')
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

  uploadFileEvt(imgFile: any): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      console.log(e.target.result);
      this.dataimage = e.target.result;
    };

    reader.readAsDataURL(imgFile.target.files[0]);

    // Reset if duplicate image uploaded again
    // this.fileInput.nativeElement.value = '';
  }

  onSave(configuration: FormGroup, editor): void {
    // testing
    console.log(editor);
    configuration.value.description = editor.editorWatchdog._data.main;
    configuration.value.logo = this.dataimage;

    this.store.dispatch(new SaveConfiguration(configuration.value));
  }

  onPublish(configuration: FormGroup, editor): void {
    configuration.value.description = editor.editorWatchdog._data.main;

    this.store.dispatch(new PublishConfiguration(configuration.value));
  }

  onReset(): void {
    this.formWithState(this.configurationPublished$);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
