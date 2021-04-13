import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { LogoutUser } from 'src/app/store/admin.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private store: Store) {}

  onLogout(): void {
    this.store.dispatch(new LogoutUser());
  }
}
