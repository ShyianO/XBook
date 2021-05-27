import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { WebsiteRoutingModule } from './website-routing.module';

import { MainComponent } from './components/main/main.component';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    TranslateModule,
    WebsiteRoutingModule,
    MatCarouselModule.forRoot()
  ]
})
export class WebsiteModule {}
