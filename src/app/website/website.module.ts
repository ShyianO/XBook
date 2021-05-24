import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainComponent } from './components/main/main.component';
import { RouterModule } from '@angular/router';
import { WebsiteRoutingModule } from './website-routing.module';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, RouterModule, WebsiteRoutingModule]
})
export class WebsiteModule {}
