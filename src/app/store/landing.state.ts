import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Action, State, StateContext } from '@ngxs/store';

import { RegisterUser } from './landing.action';
import { IRegisterRequest } from '../core/interfaces/register.interface';

export interface IRegisterModel {
  user: IRegisterRequest[];
}

@State<IRegisterModel>({
  name: 'user',
  defaults: {
    user: []
  }
})
@Injectable()
export class LandingState {
  @Action(RegisterUser)
  registerUser(
    ctx: StateContext<IRegisterModel>,
    { payload }: RegisterUser
  ): void {
    const state = ctx.getState();
    const patchState = ctx.patchState;

    patchState({
      user: [...state.user, { ...payload, loading: true }]
    });

    Backendless.UserService.register<IRegisterRequest>(payload)
      .then((result: IRegisterRequest) => {
        console.log('Registered User:', result);

        patchState({
          user: [...state.user, { ...payload, loading: false }]
        });
      })
      .catch((error) => {
        console.error('Can not Register User:', error.message);

        patchState({
          user: [...state.user, { ...payload, loading: false }]
        });
      });
  }
}
