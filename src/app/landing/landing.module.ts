import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MainComponent,
    RegisterComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule],
  providers: [],
  exports: [HeaderComponent, FooterComponent, MainComponent, RegisterComponent]
})
export class LandingModule {}
