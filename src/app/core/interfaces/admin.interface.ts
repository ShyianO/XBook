export interface IAdminState {
  currentUser: Backendless.User;
  isLoggedIn: boolean;
  loading: boolean;
  isUserDataIncorrect: boolean;
}
