import { IUser } from './user.interface';
import { IConfiguration } from './configuration.interface';
import { IImage } from './image.interface';

export interface IAdminState {
  currentUser: IUser;
  isLoggedIn: boolean;
  loading: boolean;
  isUserDataIncorrect: boolean;
  configurationDraft: IConfiguration;
  configurationPublished: IConfiguration;
  images: IImage[];
}
