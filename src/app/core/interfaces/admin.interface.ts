import { IUser } from './user.interface';

export interface IAdminState {
  currentUser: IUser;
  isLoggedIn: boolean;
  loading: boolean;
  isUserDataIncorrect: boolean;
}
