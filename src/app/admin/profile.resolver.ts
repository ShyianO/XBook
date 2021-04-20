import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { filter, take, tap } from 'rxjs/operators';

import { IUser } from '../core/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver implements Resolve<Observable<IUser>> {
  constructor(private router: Router) {}

  @Select((state) => state.adminState.currentUser)
  currentUser$: Observable<IUser>;

  resolve(): Observable<IUser> {
    return this.currentUser$.pipe(
      filter((user) => user !== null),
      take(1),
      tap((value) => {
        if (!value.firstName || !value.lastName) {
          this.router.navigate(['/admin/profile']);
        }
      })
    );
  }
}
