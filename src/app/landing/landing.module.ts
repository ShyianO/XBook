import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, MainComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule],
  providers: [],
  exports: [HeaderComponent, FooterComponent, MainComponent]
})
export class LandingModule {}
