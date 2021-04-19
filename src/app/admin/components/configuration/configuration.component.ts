import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SaveConfiguration } from '../../../store/admin.action';
import { IConfiguration } from '../../../core/interfaces/configuration.interface';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  configurationForm: FormGroup;

  constructor(private store: Store) {}

  @Select((state) => state.adminState.loading)
  loading$: Observable<boolean>;

  @Select((state) => state.adminState.configuration)
  configuration$: Observable<IConfiguration>;

  ngOnInit(): void {
    this.configuration$.subscribe((configuration) => {
      // const { title, phoneNumber, address, description } = configuration;
      console.log(configuration);

      this.configurationForm = new FormGroup({
        title: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.-]*$')
        ]),
        phoneNumber: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        description: new FormControl('')
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
}
