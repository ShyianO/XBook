import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Select } from '@ngxs/store';
import { iif, Observable, of } from 'rxjs';

import { BackendlessService } from '../core/services/backendless.service';
import { catchError, map, mergeMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  @Select((state) => state.landingState.isLoggedIn)
  isLoggedIn$: Observable<boolean>;

  constructor(
    private router: Router,
    private backendlessService: BackendlessService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.isLoggedIn$.pipe(
      take(1),
      mergeMap((value) =>
        iif(() => value, of(true), this.backendlessService.isValidLogin())
      ),
      catchError((err) => {
        this.router.navigate(['/landing/login']);
        return of(false);
      })
    );
  }
}
