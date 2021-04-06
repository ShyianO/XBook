import { IRegisterRequest } from '../core/interfaces/register.interface';
import { IMessageRequest } from '../core/interfaces/message.interface';
import { ILoginRequest } from '../core/interfaces/login.interface';

export class RegisterUser {
  static readonly type = '[User] Register';
  constructor(public user: IRegisterRequest) {}
}

export class RegisterUserSuccess {
  static readonly type = '[User] RegisterSuccess';
  constructor(public user: IRegisterRequest) {}
}

export class RegisterUserError {
  static readonly type = '[User] RegisterError';
}

export class UserExists {
  static readonly type = '[User] Exist';
  constructor(public username: string) {}
}

export class SendMessage {
  static readonly type = '[Message] Send';
  constructor(public message: IMessageRequest) {}
}

export class SendMessageSuccess {
  static readonly type = '[Message] SendSuccess';
}

export class SendMessageError {
  static readonly type = '[Message] SendError';
}

export class LoginUser {
  static readonly type = '[User] Login';
  constructor(public user: ILoginRequest) {}
}

export class LoginUserSuccess {
  static readonly type = '[User] LoginSuccess';
  constructor(public user: any) {}
}

export class LoginUserError {
  static readonly type = '[User] LoginError';
}

export class LogoutUser {
  static readonly type = '[User] Logout';
}

export class UserLoggedIn {
  static readonly type = '[User] LoggedIn';
}

export class UserLoggedInSuccess {
  static readonly type = '[User] LoggedInSuccess';
  constructor(public user: any) {}
}
