import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { LandingModule } from './landing/landing.module';
import { SharedModule } from './shared/shared.module';

import { HeaderComponent } from './landing/components/header/header.component';
import { FooterComponent } from './landing/components/footer/footer.component';
import { MainComponent } from './landing/components/main/main.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, MainComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule
    // LandingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
