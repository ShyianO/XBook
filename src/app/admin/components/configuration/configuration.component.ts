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

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  configurationForm: FormGroup;
  subject = new Subject();
  isSaved = false;
  dataimage: string;
  public Editor = ClassicEditor;

  countries: string[] = ['Ukraine', 'United States', 'United Kingdom'];
  states: {
    Ukraine: string[];
    'United States': string[];
    'United Kingdom': string[];
  } = {
    Ukraine: [
      'Autonomous Republic of Crimea',
      'Cherkasy Oblast',
      'Chernihiv Oblast',
      'Chernivtsi Oblast',
      'Dnipropetrovsk Oblast',
      'Donetsk Oblast',
      'Ivano-Frankivsk Oblast',
      'Kharkiv Oblast',
      'Kherson Oblast',
      'Khmelnytskyi Oblast',
      'Kyiv Oblast',
      'Kirovohrad Oblast',
      'Luhansk Oblast',
      'Lviv Oblast',
      'Mykolaiv Oblast',
      'Odessa Oblast',
      'Poltava Oblast',
      'Rivne Oblast',
      'Sumy Oblast',
      'Ternopil Oblast',
      'Vinnytsia Oblast',
      'Volyn Oblast',
      'Zakarpattia Oblast',
      'Zaporizhzhia Oblast',
      'Zhytomyr Oblast'
    ],
    'United States': [
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
    ],
    'United Kingdom': [
      'Avon',
      'Bedfordshire',
      'Berkshire',
      'Buckinghamshire',
      'Cambridgeshire',
      'Cheshire',
      'Cleveland',
      'Cornwall',
      'Cumbria',
      'Derbyshire',
      'Devon',
      'Dorset',
      'Durham',
      'East Sussex',
      'Essex',
      'Gloucestershire',
      'Hampshire',
      'Herefordshire',
      'Hertfordshire',
      'Isle of Wight',
      'Kent',
      'Lancashire',
      'Leicestershire',
      'Lincolnshire',
      'London',
      'Merseyside',
      'Middlesex',
      'Norfolk',
      'Northamptonshire',
      'Northumberland',
      'North Humberside',
      'North Yorkshire',
      'Nottinghamshire',
      'Oxfordshire',
      'Rutland',
      'Shropshire',
      'Somerset',
      'South Humberside',
      'South Yorkshire',
      'Staffordshire',
      'Suffolk',
      'Surrey',
      'Tyne and Wear',
      'Warwickshire',
      'West Midlands',
      'West Sussex',
      'West Yorkshire',
      'Wiltshire',
      'Worcestershire',
      'Clwyd',
      'Dyfed',
      'Gwent',
      'Gwynedd',
      'Mid Glamorgan',
      'Powys',
      'South Glamorgan',
      'West Glamorgan',
      'Aberdeenshire',
      'Angus',
      'Argyll',
      'Ayrshire',
      'Banffshire',
      'Berwickshire',
      'Bute',
      'Caithness',
      'Clackmannanshire',
      'Dumfriesshire',
      'Dunbartonshire',
      'East Lothian',
      'Fife',
      'Inverness-shire',
      'Kincardineshire',
      'Kinross-shire',
      'Kirkcudbrightshire',
      'Lanarkshire',
      'Midlothian',
      'Moray',
      'Nairnshire',
      'Orkney',
      'Peeblesshire',
      'Perthshire',
      'Renfrewshire',
      'Ross-shire',
      'Roxburghshire',
      'Selkirkshire',
      'Shetland',
      'Stirlingshire',
      'Sutherland',
      'West Lothian',
      'Wigtownshire',
      'Antrim',
      'Armagh',
      'Down',
      'Fermanagh',
      'Londonderry',
      'Tyrone'
    ]
  };
  countryStates: string;

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

        this.dataimage = conf.logo;

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

  // selectCountry(country): void {
  //   if (country)
  // }

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
