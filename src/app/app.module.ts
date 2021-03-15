import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import Backendless from 'backendless';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { TodoState } from './store/todo.state';
import { AppUserService } from './app-user.service';

import { LandingModule } from './landing/landing.module';
import { SharedModule } from './shared/shared.module';

Backendless.initApp(
  environment.backendless.APP_ID,
  environment.backendless.API_KEY
);

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
  providers: [AppUserService],
  bootstrap: [AppComponent]
})
export class AppModule {}
