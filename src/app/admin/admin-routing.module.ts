import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminGuard } from './admin.guard';
import { ProfileResolver } from './profile.resolver';
import { MainComponent } from './components/main/main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StatisticComponent } from './components/statistic/statistic.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        resolve: { data: ProfileResolver }
      },
      {
        path: 'configuration',
        component: ConfigurationComponent,
        resolve: { data: ProfileResolver }
      },
      {
        path: 'bookings',
        component: BookingsComponent,
        resolve: { data: ProfileResolver }
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'statistic',
        component: StatisticComponent,
        resolve: { data: ProfileResolver }
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
