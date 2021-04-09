import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { iif, Observable, of } from 'rxjs';

import { BackendlessService } from '../core/services/backendless.service';
import { catchError, mergeMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  @Select((state) => state.adminState.isLoggedIn)
  isLoggedIn$: Observable<boolean>;

  constructor(
    private router: Router,
    private backendlessService: BackendlessService
  ) {}

  canActivate(): Observable<boolean> {
    return this.isLoggedIn$.pipe(
      take(1),
      mergeMap((value) =>
        iif(() => value, of(true), this.backendlessService.isValidLogin())
      ),
      catchError(() => {
        this.router.navigate(['/landing/login']);
        return of(false);
      })
    );
  }
}
