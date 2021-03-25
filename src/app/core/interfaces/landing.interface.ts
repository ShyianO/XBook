import { IUser } from './user.interface';

export interface ILandingState {
  user: IUser;
  loading: boolean;
  successMessage: boolean;
  errorMessage: boolean;
}
