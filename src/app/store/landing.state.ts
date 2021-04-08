import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';

import {
  RegisterUser,
  RegisterUserError,
  RegisterUserSuccess,
  SendMessage,
  SendMessageError,
  SendMessageSuccess,
  UserExists
} from './landing.action';
import { IRegisterRequest } from '../core/interfaces/register.interface';
import { ILandingState } from '../core/interfaces/landing.interface';

@State<ILandingState>({
  name: 'landingState',
  defaults: {
    user: null,
    loading: false,
    userExists: false
  }
})
@Injectable()
export class LandingState {
  constructor(private router: Router, private store: Store) {}

  @Action(RegisterUser)
  registerUser(ctx: StateContext<ILandingState>, { user }: RegisterUser): void {
    const patchState = ctx.patchState;

    patchState({ loading: true });

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
      loading: false
    });
  }

  @Action(RegisterUserError)
  registerUserError(ctx: StateContext<ILandingState>): void {
    ctx.patchState({ loading: false });
  }

  @Action(UserExists)
  userExists(ctx: StateContext<ILandingState>, { username }: UserExists): void {
    const query = Backendless.DataQueryBuilder.create().setWhereClause(
      `username = '${username}'`
    );

    Backendless.Data.of('Users')
      .find(query)
      .then((foundContacts) => {
        if (foundContacts.length > 0) {
          ctx.patchState({ userExists: true });
        } else {
          ctx.patchState({ userExists: false });
        }
      })
      .catch((fault) => {
        console.log(fault);
      });
  }

  @Action(SendMessage)
  sendMessage(
    ctx: StateContext<ILandingState>,
    { message }: SendMessage
  ): void {
    ctx.patchState({ loading: true });

    Backendless.Data.of('Contacts')
      .save(message)
      .then((success) => {
        console.log(success);

        this.store.dispatch(new SendMessageSuccess());
      })
      .catch((error) => {
        console.log(error);

        this.store.dispatch(new SendMessageError());
      });
  }

  @Action(SendMessageSuccess)
  sendMessageSuccess(ctx: StateContext<ILandingState>): void {
    ctx.patchState({ loading: false });
  }

  @Action(SendMessageError)
  sendMessageError(ctx: StateContext<ILandingState>): void {
    ctx.patchState({ loading: false });
  }
}
