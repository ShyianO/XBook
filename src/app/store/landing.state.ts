import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';

import {
  RegisterUser,
  RegisterUserError,
  RegisterUserSuccess,
  UserExists
} from './landing.action';
import { IRegisterRequest } from '../core/interfaces/register.interface';
import { ILandingState } from '../core/interfaces/landing.interface';
import { delay } from 'rxjs/operators';

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
      loading: false
    });
  }

  @Action(RegisterUserError)
  registerUserError(ctx: StateContext<ILandingState>): void {
    ctx.patchState({
      loading: false
    });
  }

  @Action(UserExists)
  userExists(ctx: StateContext<ILandingState>, { username }: UserExists): void {
    ctx.patchState({
      userExists: false
    });

    const PAGE_SIZE = 100;

    const fetchAllObjects = async (tableName) => {
      let offset = 0;
      let totalCount = 0;
      let lastPageSize = 0;
      const itemsCollection = [];

      do {
        const pageQuery = Backendless.DataQueryBuilder.create();

        pageQuery.setPageSize(PAGE_SIZE);
        pageQuery.setOffset(offset);

        const items = await Backendless.Data.of(tableName).find(pageQuery);

        lastPageSize = items.length;

        itemsCollection.push(...items);

        offset += PAGE_SIZE;
        totalCount += lastPageSize;
      } while (lastPageSize >= PAGE_SIZE);

      itemsCollection.forEach((user) => {
        if (user.username === username) {
          ctx.patchState({
            userExists: true
          });
        }
      });

      console.log(ctx.getState());
    };

    Promise.resolve().then(() => fetchAllObjects('Users'));
  }
}
