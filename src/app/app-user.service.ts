import { Injectable } from '@angular/core';
import Backendless from 'backendless';

@Injectable({
  providedIn: 'root'
})
export class AppUserService extends Backendless.User {
  name: string;
}

const user: AppUserService = new AppUserService();
user.email = 'michael@backendless.com';
user.password = 'my_super_password';
user.name = 'Michael';

Backendless.UserService.register<AppUserService>(user)
  .then((result: AppUserService) => console.log('Registered User:', result))
  .catch((error) => console.error('Can not Register User:', error.message));
