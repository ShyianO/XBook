import { IUser } from './user.interface';
import { IConfiguration } from './configuration.interface';

export interface IAdminState {
  currentUser: IUser;
  isLoggedIn: boolean;
  loading: boolean;
  isUserDataIncorrect: boolean;
  configuration: IConfiguration;
}
