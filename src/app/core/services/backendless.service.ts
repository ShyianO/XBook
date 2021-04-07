import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { environment } from '../../../environments/environment';
import { Store } from '@ngxs/store';

import { UserLoggedIn, UserLoggedInFalse } from '../../store/landing.action';

@Injectable({
  providedIn: 'root'
})
export class BackendlessService {
  constructor(private store: Store) {}
  init(): void {
    Backendless.serverURL = 'https://eu-api.backendless.com';
    Backendless.initApp(
      environment.backendless.APP_ID,
      environment.backendless.API_KEY
    );
  }

  isValidLogin(): void {
    Backendless.UserService.isValidLogin()
      .then((success: boolean) => {
        if (success) {
          this.store.dispatch(new UserLoggedIn());
        } else {
          this.store.dispatch(new UserLoggedInFalse());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
