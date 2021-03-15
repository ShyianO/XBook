import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { TodoState } from './store/todo.state';

import { LandingModule } from './landing/landing.module';
import { SharedModule } from './shared/shared.module';

import Backendless from 'backendless';

const APP_ID = '2FA3E688-ADE5-556D-FFA2-2F42B5F5FB00';
const API_KEY = 'CB2A4850-B144-4F23-9C45-5C4D2BC2FF04';

Backendless.initApp(APP_ID, API_KEY);

class AppUser extends Backendless.User {
  name: string;
}

const user: AppUser = new AppUser();
user.email = 'michael@backendless.com';
user.password = 'my_super_password';
user.name = 'Michael';

Backendless.UserService.register<AppUser>(user)
  .then((result: AppUser) => console.log('Registered User:', result))
  .catch((error) => console.error('Can not Register User:', error.message));

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    SharedModule,
    LandingModule,

    NgxsModule.forRoot([TodoState], {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
