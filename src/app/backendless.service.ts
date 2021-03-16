import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendlessService {
  init(): void {
    Backendless.initApp(
      environment.backendless.APP_ID,
      environment.backendless.API_KEY
    );
  }
}
