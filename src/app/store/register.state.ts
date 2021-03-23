import { Injectable } from '@angular/core';
import { Action } from '@ngxs/store';
import { RegisterUser } from './register.action';
// import Backendless from 'backendless';

// class AppUser extends Backendless.User {
//   name: string;
// }
//
// const user: AppUser = new AppUser();
// user.email = 'michael@backendless.com';
// user.password = 'my_super_password';
// user.name = 'Michael';

@Injectable()
export class RegisterState {
  @Action(RegisterUser)
  registerUser({ payload }: RegisterUser): void {
    console.log(payload);

    // Backendless.UserService.register<AppUser>(user)
    //   .then((result: AppUser) => console.log('Registered User:', result))
    //   .catch((error) => console.error('Can not Register User:', error.message));
  }
}
