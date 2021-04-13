import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { AdminGuard } from './admin.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'configuration',
        component: ConfigurationComponent
      },
      {
        path: 'bookings',
        component: BookingsComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'statistic',
        component: StatisticComponent
      },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
    component: MainComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
