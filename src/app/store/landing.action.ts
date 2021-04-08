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
