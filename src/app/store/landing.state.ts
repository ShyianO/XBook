import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Action } from '@ngxs/store';

import { RegisterUser } from './landing.action';
import { IRegisterRequest } from '../core/interfaces/register.interface';

@Injectable()
export class LandingState {
  @Action(RegisterUser)
  registerUser(testState, { payload }: RegisterUser): void {
    Backendless.UserService.register<IRegisterRequest>(payload)
      .then((result: IRegisterRequest) =>
        console.log('Registered User:', result)
      )
      .catch((error) => console.error('Can not Register User:', error.message));
  }
}
