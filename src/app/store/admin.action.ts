import { ILoginRequest } from '../core/interfaces/login.interface';

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
