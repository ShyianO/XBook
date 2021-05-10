import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserLoggedInSuccess } from '../../store/admin.action';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TestService implements HttpInterceptor {
  constructor(private store: Store) {}
  private cache: Map<HttpRequest<any>, HttpResponse<any>> = new Map();

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (environment.test) {
      // const user = {
      //   username: 'Admin',
      //   email: 'admin@test.com',
      //   password: 'admin',
      //   firstName: 'admin',
      //   lastName: 'admin',
      //   accountType: 'BACKENDLESS',
      //   address: 'test',
      //   blUserLocale: 'uk',
      //   created: 1618213192319,
      //   lastLogin: 1620288335000,
      //   oAuthIdentities: null,
      //   phoneNumber: '1231231231',
      //   socialAccount: 'BACKENDLESS',
      //   updated: 1618825748595,
      //   userStatus: 'ENABLED',
      //   ___class: 'Users'
      // };
      //
      // this.store.dispatch(new UserLoggedInSuccess(user));
      // for testing

      if (req.method !== 'GET') {
        return next.handle(req);
      }

      const cachedResponse: HttpResponse<any> = this.cache.get(req);

      if (cachedResponse) {
        return of(cachedResponse.clone());
      } else {
        return next.handle(req).pipe(
          tap((stateEvent) => {
            if (stateEvent instanceof HttpResponse) {
              if (stateEvent.url.includes('backendless')) {
                this.cache.set(req, stateEvent.clone());
              } else {
                return this.intercept(req, next);
              }
            }
          })
        );
      }
    }
  }
}
