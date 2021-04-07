import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  NavigationStart,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BackendlessService } from './backendless.service';

@Injectable({
  providedIn: 'root'
})
export class RoutingService implements OnDestroy, CanActivate {
  subject = new Subject();
  isLoggedIn: boolean;

  @Select((state) => state.landingState.isLoggedIn)
  isLoggedIn$: Observable<boolean>;

  constructor(
    private router: Router,
    private backendlessService: BackendlessService
  ) {
    this.routeEvent(this.router);

    this.isLoggedIn$
      .pipe(takeUntil(this.subject))
      .subscribe((value: boolean) => {
        this.isLoggedIn = value;
      });
  }

  routeEvent(router: Router): void {
    router.events.pipe(takeUntil(this.subject)).subscribe((e) => {
      if (e instanceof NavigationStart) {
        this.backendlessService.isValidLogin();
      }
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('CanActive starting, value of isLoggedIn is' + this.isLoggedIn);

    if (this.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/landing/login']);
      return false;
    }
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
