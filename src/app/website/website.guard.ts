import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { iif, Observable, of } from 'rxjs';
import { catchError, mergeMap, take, tap } from 'rxjs/operators';
import { BackendlessService } from '../core/services/backendless.service';
import { Select } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class WebsiteGuard implements CanActivate {
  constructor(
    private router: Router,
    private backendlessService: BackendlessService
  ) {}

  @Select((state) => state.adminState.isLoggedIn)
  isLoggedIn$: Observable<boolean>;

  canActivate(): Observable<boolean> {
    return this.isLoggedIn$.pipe(
      take(1),
      mergeMap((value) =>
        iif(() => value, of(true), this.backendlessService.isValidLogin())
      ),
      catchError(() => {
        return of(false);
      }),
      tap((value) => {
        if (!value) {
          this.router.navigate(['/landing/login']);
        }
      })
    );
  }
}
