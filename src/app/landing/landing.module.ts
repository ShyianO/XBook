import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RouterOutlet } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { LandingComponent } from './landing.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/main/main.module').then((m) => m.MainModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MainComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  exports: [
    HeaderComponent,
    FooterComponent,
    MainComponent,
    RegisterComponent,
    RouterOutlet,
    RouterModule
  ]
})
export class LandingModule {}
