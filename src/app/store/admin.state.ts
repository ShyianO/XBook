import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';

import {
  LoginUser,
  LoginUserError,
  LoginUserSuccess,
  UserLoggedIn,
  UserLoggedInSuccess,
  UserNotLoggedIn,
  LogoutUser,
  UpdateUser,
  UpdateUserSuccess,
  UpdateUserError
} from './admin.action';
import { IAdminState } from '../core/interfaces/admin.interface';

@State<IAdminState>({
  name: 'adminState',
  defaults: {
    currentUser: null,
    isLoggedIn: false,
    loading: false,
    isUserDataIncorrect: false
  }
})
@Injectable()
export class AdminState {
  constructor(private router: Router, private store: Store) {}

  @Action(LoginUser)
  loginUser(ctx: StateContext<IAdminState>, { user }: LoginUser): void {
    ctx.patchState({ loading: true });

    Backendless.UserService.login(user.email, user.password, true)
      .then((loggedInUser) => {
        this.store.dispatch(new LoginUserSuccess(loggedInUser));
      })
      .catch((error) => {
        console.log(error);

        this.store.dispatch(new LoginUserError());
      });
  }

  @Action(LoginUserSuccess)
  loginUserSuccess(
    ctx: StateContext<IAdminState>,
    { user }: LoginUserSuccess
  ): void {
    ctx.patchState({
      currentUser: { ...user },
      loading: false,
      isLoggedIn: true,
      isUserDataIncorrect: false
    });
  }

  @Action(LoginUserError)
  loginUserError(ctx: StateContext<IAdminState>): void {
    ctx.patchState({ loading: false, isUserDataIncorrect: true });
  }

  @Action(UserLoggedIn)
  userLoggedIn(): void {
    Backendless.UserService.getCurrentUser()
      .then((user) => {
        this.store.dispatch(new UserLoggedInSuccess(user));
      })
      .catch(() => {
        this.store.dispatch(new UserNotLoggedIn());
      });
  }

  @Action(UserLoggedInSuccess)
  userLoggedInSuccess(
    ctx: StateContext<IAdminState>,
    { user }: UserLoggedInSuccess
  ): void {
    ctx.patchState({ currentUser: { ...user }, isLoggedIn: true });
  }

  @Action(UserNotLoggedIn)
  userNotLoggedIn(ctx: StateContext<IAdminState>): void {
    ctx.patchState({ currentUser: null, isLoggedIn: false });
  }

  @Action(LogoutUser)
  logOut(ctx: StateContext<IAdminState>): void {
    Backendless.UserService.logout()
      .then(() => {
        ctx.patchState({ currentUser: null, isLoggedIn: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  @Action(UpdateUser)
  updateUser(
    ctx: StateContext<IAdminState>,
    { updatedUser }: UpdateUser
  ): void {
    ctx.patchState({ loading: true });

    updatedUser.objectId = ctx.getState().currentUser.objectId;

    if (updatedUser.password.length === 0) {
      updatedUser.password = null;
    }

    console.log(updatedUser);

    Backendless.UserService.update(updatedUser)
      .then((updatedCurrentUser) => {
        this.store.dispatch(new UpdateUserSuccess(updatedCurrentUser));
      })
      .catch((error) => {
        console.log(error);

        this.store.dispatch(new UpdateUserError());
      });
  }

  @Action(UpdateUserSuccess)
  updateUserSuccess(
    ctx: StateContext<IAdminState>,
    { updatedCurrentUser }: UpdateUserSuccess
  ): void {
    console.log(updatedCurrentUser);
    const state = ctx.getState();

    ctx.patchState({
      currentUser: { ...state.currentUser, ...updatedCurrentUser },
      loading: false
    });
  }

  @Action(UpdateUserError)
  updateUserError(ctx: StateContext<IAdminState>): void {
    ctx.patchState({ loading: false });
  }
}
