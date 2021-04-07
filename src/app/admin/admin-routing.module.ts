import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, NavigationStart } from '@angular/router';
import { BackendlessService } from '../core/services/backendless.service';

import { MainComponent } from './components/main/main.component';
import { HomepageComponent } from './components/homepage/homepage.component';
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
        path: '',
        component: HomepageComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AdminGuard]
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
      }
    ],
    component: MainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
