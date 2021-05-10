import { Injectable } from '@angular/core';

import { TranslationService } from './translation.service';
import { BackendlessService } from './backendless.service';
import { environment } from '../../../environments/environment';
import { TestService } from './test.service';

export function initializeApp(
  startupInitService: StartupService
): () => Promise<void> {
  return () => {
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

  init(): Promise<void> {
    return new Promise((resolve) => {
      this.translateService.init();
      this.backendlessService.init();

      resolve();
    });
  }
}
