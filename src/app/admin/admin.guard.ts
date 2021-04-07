import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, of } from 'rxjs';

import { BackendlessService } from '../core/services/backendless.service';
import { catchError, map } from 'rxjs/operators';

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
      map((e) => {
        if (e) {
          console.log(e);
          return true;
        }

        this.router.navigate(['/admin']);

        return false;
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }
}
