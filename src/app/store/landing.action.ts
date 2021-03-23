import { IRegisterRequest } from '../core/interfaces/register.interface';

export class RegisterUser {
  static readonly type = '[User] Register';
  constructor(public payload: IRegisterRequest) {}
}
