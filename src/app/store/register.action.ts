import { IRegister } from '../landing/components/register/register.interface';

export class RegisterUser {
  static readonly type = '[User] Register';
  constructor(public payload: IRegister) {}
}
