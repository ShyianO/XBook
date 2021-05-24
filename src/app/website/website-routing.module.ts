import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { WebsiteGuard } from './website.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [WebsiteGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule {}
