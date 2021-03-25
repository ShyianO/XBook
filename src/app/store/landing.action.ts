import { IRegisterRequest } from '../core/interfaces/register.interface';

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
