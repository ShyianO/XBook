import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { LoadConfiguration } from '../../../store/admin.action';
import { Observable } from 'rxjs';
import { IUser } from '../../../core/interfaces/user.interface';
import { filter, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(private store: Store, private router: Router) {}

  @Select((state) => state.adminState.currentUser)
  currentUser$: Observable<IUser>;

  ngOnInit(): void {
    this.currentUser$
      .pipe(
        filter((user) => user !== null),
        take(1),
        tap((value) => {
          if (!value.firstName || !value.lastName) {
            this.router.navigate(['/admin/profile']);
          } else {
            this.store.dispatch(new LoadConfiguration());
          }
        })
      )
      .subscribe();
  }
}
