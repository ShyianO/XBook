import { ILoginRequest } from '../core/interfaces/login.interface';
import { IUpdateRequest } from '../core/interfaces/update.interface';
import { IConfiguration } from '../core/interfaces/configuration.interface';
import { IImage } from '../core/interfaces/image.interface';

export class LoginUser {
  static readonly type = '[User] Login';
  constructor(public user: ILoginRequest) {}
}

export class LoginUserSuccess {
  static readonly type = '[User] LoginSuccess';
  constructor(public user: Backendless.User) {}
}

export class LoginUserError {
  static readonly type = '[User] LoginError';
}

export class UserLoggedIn {
  static readonly type = '[User] LoggedIn';
}

export class UserLoggedInSuccess {
  static readonly type = '[User] LoggedInSuccess';
  constructor(public user: Backendless.User) {}
}

export class UserNotLoggedIn {
  static readonly type = '[User] NotLoggedIn';
}

export class LogoutUser {
  static readonly type = '[User] Logout';
}

export class UpdateUser {
  static readonly type = '[User] Update';
  constructor(public updatedUser: IUpdateRequest) {}
}

export class UpdateUserSuccess {
  static readonly type = '[User] UpdateSuccess';
  constructor(public updatedCurrentUser: IUpdateRequest) {}
}

export class UpdateUserError {
  static readonly type = '[User] UpdateError';
}

export class SaveConfiguration {
  static readonly type = '[Configuration] Save';
  constructor(public configuration: IConfiguration) {}
}

export class SaveImages {
  static readonly type = '[Images] Save';
  constructor(public images: IImage[]) {}
}

export class PublishConfiguration {
  static readonly type = '[Configuration] Publish';
  constructor(public configuration: IConfiguration) {}
}

export class LoadConfiguration {
  static readonly type = '[Configuration] Load';
}

export class LoadImages {
  static readonly type = '[Images] Load';
}

export class SetLoader {
  static readonly type = '[Loader] Set';
}
