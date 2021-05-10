import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserLoggedInSuccess } from '../../store/admin.action';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  constructor(private store: Store) {}

  init(): void {
    const user = {
      username: 'Admin',
      email: 'admin@test.com',
      password: 'admin',
      firstName: 'admin',
      lastName: 'admin',
      accountType: 'BACKENDLESS',
      address: 'test',
      blUserLocale: 'uk',
      created: 1618213192319,
      lastLogin: 1620288335000,
      oAuthIdentities: null,
      phoneNumber: '1231231231',
      socialAccount: 'BACKENDLESS',
      updated: 1618825748595,
      userStatus: 'ENABLED',
      ___class: 'Users'
    };

    this.store.dispatch(new UserLoggedInSuccess(user));
  }
}
