import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { BackendlessService } from '../core/services/backendless.service';
import { LoadConfiguration } from '../store/admin.action';
import { filter, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationGuard implements CanActivate {
  constructor(
    private router: Router,
    private backendlessService: BackendlessService,
    private store: Store
  ) {}

  @Select((state) => state.adminState.isLoggedIn)
  isLoggedIn$: Observable<boolean>;

  canActivate(): Observable<boolean> {
    return this.isLoggedIn$.pipe(
      filter((isUser) => isUser !== false),
      take(1),
      tap(() => {
        this.store.dispatch(new LoadConfiguration());
      })
    );
  }
}
