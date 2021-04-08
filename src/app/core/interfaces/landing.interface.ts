import { IUser } from './user.interface';

export interface ILandingState {
  user: IUser;
  loading: boolean;
  userExists: boolean;
}
