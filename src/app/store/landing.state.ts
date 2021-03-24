import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Action, State, StateContext } from '@ngxs/store';
import { Router } from '@angular/router';

import { RegisterUser } from './landing.action';
import { IRegisterRequest } from '../core/interfaces/register.interface';
import { ILandingState } from '../core/interfaces/landing.interface';

@State<ILandingState>({
  name: 'landingState',
  defaults: {
    user: [],
    loading: false,
    flashMessage: false
  }
})
@Injectable()
export class LandingState {
  constructor(private router: Router) {}

  @Action(RegisterUser)
  registerUser(
    ctx: StateContext<ILandingState>,
    { payload }: RegisterUser
  ): void {
    const state = ctx.getState();
    const patchState = ctx.patchState;

    patchState({
      loading: true
    });

    console.log(state);

    Backendless.UserService.register<IRegisterRequest>(payload)
      .then((result: IRegisterRequest) => {
        console.log('Registered User:', result);

        patchState({
          user: [{ ...payload }],
          loading: false
        });
      })
      .catch((error) => {
        console.error('Can not Register User:', error.message);

        patchState({
          loading: false
        });
      });
  }
}
