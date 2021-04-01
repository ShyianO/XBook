import { Component, Inject, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  langValue = 'EN';

  languageList = [
    { code: 'en', label: 'EN' },
    { code: 'ua', label: 'UA' }
  ];

  constructor(@Inject(LOCALE_ID) protected localeId: string) {}
}
