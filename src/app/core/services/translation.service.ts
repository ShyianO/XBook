import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';

export function HttpLoaderFactory(httpClient: HttpClient): any {
  return new TranslateHttpLoader(httpClient);
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(public translate: TranslateService) {}

  init(): void {
    this.translate.addLangs(['en', 'uk']);
    this.translate.setDefaultLang('en');

    const browserLang = this.translate.getBrowserLang();
    const storageLang = localStorage.getItem('language');

    this.translate.use(storageLang ? storageLang : browserLang);
  }

  selectLanguage(lang): void {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }
}
