import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { environment } from '../../../environments/environment';
import { Store } from '@ngxs/store';
import { defer, from, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { UserLoggedIn, UserNotLoggedIn } from '../../store/admin.action';

@Injectable({
  providedIn: 'root'
})
export class BackendlessService {
  constructor(private store: Store, private router: Router) {}

  init(): void {
    Backendless.serverURL = 'https://eu-api.backendless.com';
    Backendless.initApp(
      environment.backendless.APP_ID,
      environment.backendless.API_KEY
    );
  }

  isValidLogin(): Observable<boolean> {
    return defer(() =>
      from(
        Backendless.UserService.isValidLogin()
          .then((success: boolean) => {
            console.log(success);
            if (success) {
              this.store.dispatch(new UserLoggedIn());
            } else {
              this.router.navigate(['/landing/login']);
              this.store.dispatch(new UserNotLoggedIn());
            }

            return success;
          })
          .catch(() => {
            return false;
          })
      )
    );
  }
}
