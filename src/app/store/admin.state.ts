import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Router } from '@angular/router';

import {
  LoadConfiguration,
  LoadImages,
  LoginUser,
  LoginUserError,
  LoginUserSuccess,
  LogoutUser,
  PublishConfiguration,
  SaveConfiguration,
  SaveImages,
  SetLoader,
  UpdateUser,
  UpdateUserError,
  UpdateUserSuccess,
  UserLoggedIn,
  UserLoggedInSuccess,
  UserNotLoggedIn
} from './admin.action';
import { IAdminState } from '../core/interfaces/admin.interface';
import {
  IConfiguration,
  ConfigurationStatus
} from '../core/interfaces/configuration.interface';
import { ImagesService } from '../core/services/images.service';
import { IImage } from '../core/interfaces/image.interface';

@State<IAdminState>({
  name: 'adminState',
  defaults: {
    currentUser: null,
    isLoggedIn: false,
    loading: false,
    isUserDataIncorrect: false,
    configurationDraft: null,
    configurationPublished: null,
    images: []
  }
})
@Injectable()
export class AdminState {
  constructor(
    private router: Router,
    private store: Store,
    private imagesService: ImagesService
  ) {}

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
    ctx.patchState({
      currentUser: { ...user },
      isLoggedIn: true
    });
  }

  @Action(UserNotLoggedIn)
  userNotLoggedIn(ctx: StateContext<IAdminState>): void {
    ctx.patchState({ currentUser: null, isLoggedIn: false });
  }

  @Action(LogoutUser)
  logOut(ctx: StateContext<IAdminState>): void {
    Backendless.UserService.logout()
      .then(() => {
        ctx.patchState({
          currentUser: null,
          isLoggedIn: false,
          configurationDraft: null
        });
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

  @Action(SaveConfiguration)
  saveConfiguration(
    ctx: StateContext<IAdminState>,
    { configuration }: SaveConfiguration
  ): Promise<void> {
    ctx.patchState({ loading: true });

    if (configuration.gallery.length > 0) {
      this.store.dispatch(new SaveImages(configuration.gallery));
    }

    if (ctx.getState().configurationDraft) {
      configuration.objectId = ctx.getState().configurationDraft.objectId;
    } else {
      configuration.status = ConfigurationStatus.draft;
    }

    return Backendless.Data.of('Websites')
      .save(configuration)
      .then((website) => {
        ctx.patchState({ configurationDraft: website, loading: false });
      });
  }

  @Action(SaveImages)
  saveImages(ctx: StateContext<IAdminState>, { images }: SaveImages): void {
    this.store.dispatch(new SetLoader(true));

    this.imagesService.saveImages(images);
  }

  @Action(PublishConfiguration)
  publishConfiguration(
    ctx: StateContext<IAdminState>,
    { configuration }: PublishConfiguration
  ): Promise<void> {
    ctx.patchState({ loading: true });

    if (ctx.getState().configurationPublished) {
      configuration.objectId = ctx.getState().configurationPublished.objectId;
    } else {
      configuration.status = ConfigurationStatus.published;
    }

    return Backendless.Data.of('Websites')
      .save(configuration)
      .then((website) => {
        ctx.patchState({ configurationPublished: website, loading: false });
      });
  }

  @Action(LoadConfiguration)
  loadConfiguration(ctx: StateContext<IAdminState>): void {
    if (!ctx.getState().currentUser.objectId) {
      return;
    }

    this.store.dispatch(new LoadImages());

    const dataQuery = Backendless.DataQueryBuilder.create().setWhereClause(
      `ownerId = '${ctx.getState().currentUser.objectId}'`
    );

    Backendless.Data.of('Websites')
      .find(dataQuery)
      .then((website: IConfiguration[]) => {
        if (website.length === 0) {
          return;
        }

        if (website[0].status === ConfigurationStatus.draft) {
          ctx.patchState({
            configurationDraft: website[0],
            configurationPublished: website[1]
          });
        } else if (website[0].status === ConfigurationStatus.published) {
          ctx.patchState({
            configurationDraft: website[1],
            configurationPublished: website[0]
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  @Action(LoadImages)
  loadImages(ctx: StateContext<IAdminState>): void {
    const dataQuery = Backendless.DataQueryBuilder.create().setWhereClause(
      `ownerId = '${ctx.getState().currentUser.objectId}'`
    );

    Backendless.Data.of('Images')
      .find(dataQuery)
      .then((q: IImage[]) => {
        ctx.patchState({ images: q });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  @Action(SetLoader)
  setLoader(ctx: StateContext<IAdminState>, { loader }: SetLoader): void {
    ctx.patchState({ loading: loader });
  }
}
