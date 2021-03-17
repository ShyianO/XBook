import { NgModule } from '@angular/core';

import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatButtonToggleGroup,
  MatButtonToggleModule
} from '@angular/material/button-toggle';

const materialModules = [
  MatSliderModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatButtonModule,
  MatSelectModule,
  MatListModule,
  MatDividerModule,
  MatMenuModule,
  MatButtonToggleModule
];

@NgModule({
  imports: [materialModules],
  exports: [materialModules]
})
export class SharedModule {}
