import { Injectable } from '@angular/core';

import { TranslationService } from './translation.service';
import { BackendlessService } from './backendless.service';

export function initializeApp(startupInitService: StartupService): any {
  return (): Promise<any> => {
    return startupInitService.init();
  };
}

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  constructor(
    private translateService: TranslationService,
    private backendlessService: BackendlessService
  ) {}

  init(): any {
    return new Promise<void>((resolve) => {
      this.translateService.init();
      this.backendlessService.init();
      this.backendlessService.isValidLogin();
      resolve();
    });
  }
}
