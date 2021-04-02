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
  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'uk']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|uk/) ? browserLang : 'en');
  }
}
