import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';

import {
  RegisterUser,
  RegisterUserError,
  RegisterUserSuccess
} from './landing.action';
import { IRegisterRequest } from '../core/interfaces/register.interface';
import { ILandingState } from '../core/interfaces/landing.interface';

@State<ILandingState>({
  name: 'landingState',
  defaults: {
    user: null,
    loading: false,
    successMessage: false,
    errorMessage: false
  }
})
@Injectable()
export class LandingState {
  constructor(private router: Router, private store: Store) {}

  @Action(RegisterUser)
  registerUser(ctx: StateContext<ILandingState>, { user }: RegisterUser): void {
    const patchState = ctx.patchState;

    patchState({
      loading: true
    });

    Backendless.UserService.register<IRegisterRequest>(user)
      .then((result: IRegisterRequest) => {
        console.log('Registered User:', result);

        this.store.dispatch(new RegisterUserSuccess(user));
      })
      .catch((error) => {
        console.error('Can not Register User:', error.message);

        this.store.dispatch(new RegisterUserError());
      });
  }

  @Action(RegisterUserSuccess)
  registerUserSuccess(
    ctx: StateContext<ILandingState>,
    { user }: RegisterUser
  ): void {
    ctx.patchState({
      user: { ...user },
      loading: false,
      successMessage: true
    });
  }

  @Action(RegisterUserError)
  registerUserError(ctx: StateContext<RegisterUserError>): void {
    ctx.patchState({
      loading: false,
      errorMessage: true
    });
  }
}
